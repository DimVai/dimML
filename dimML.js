/**
 * @file dim-ML.js
 * @author Dimitris Vainanidis,
 * @copyright Dimitris Vainanidis 2021
 */

/* jshint unused:false , strict:global , esversion: 10, evil:true, asi:true */
"use strict"; 


{               //block, so "let" variables will not be public

   
/** write log, instead of console.log */
let log = console.log;

/** Selects {{things}} in strings. RegExp Format */
let MLexp = {
    /** Selects: {{this}},{{index}} */
    array: /\{\{(this|index)\}\}/g,
    /** Checks if is {{anything}} */
    testForNested: /(\{\{.*\}\})/,
    // Important: there is also this difference between test and replace in regex!
    // do not do /g when using .test! Because it changes if you execute (using "test" method) twice!
    // https://stackoverflow.com/questions/6891545/javascript-regexp-test-returns-false-even-though-it-should-return-true
    /** Selects: {{variable[number]}} */
    withIndex: function(index){return new RegExp(`\\{\\{${index}\\[(\\d+)\\]\\}\\}`,'g')},
    /** Selects: {{0}}, {{key}} */
    default: /\{\{(0|key)\}\}/g,
};


/** The dimML Object */
var dimML = {

    /** Stores the original outerHTML of elements, so as to be updated later */
    originalElements: {},

    /**
     * Execute the dimML job
     * @param {number} nestedLevels The maximum number of levels to go deep
     */
    populate: function(nestedLevels = 1){

        /** Just for return purposes (without reason!). All source names */
        let DataSources = new Set();  
        
        let populateElement = (element)=>{
                
            /** @type {string}  The element's data-source attribute & the name of the data source as a string */
            const sourceName = element.getAttribute('data-source');
            DataSources.add(sourceName);
            /** @type {string} The element's data-identifier attribute. How to refer to various variables within */
            const identifier = element.getAttribute('data-identifier')||null;       // null values not accepted / corrected
            /** @type {string} The element's separator between repeated HTML's */
            const separator = element.getAttribute('data-separator')||"";       // null values not accepted / corrected
            /** The array of populated HTML's to join */
            let OutputBlocks = [];

            // store element to dimML.originalElements so it can be updated later
            if (element.id) { this.originalElements[element.id] = element.outerHTML } 

            // if data-source="{{something}}", do nothing for now - maybe do something on next iteration (nested). 
            if (MLexp.testForNested.test(sourceName)) {
                return;         //return inside forEach goes to next iteration
            } else {            //Else (if you are going to do something, replace or delete), delete attributes!
                element.removeAttribute('data-source');
                element.removeAttribute('data-identifier');
            }

            try{
                // Now, we want the array of the variables to populate!
                // eval converts string to variable name (eg: 'pets' string => pets array). This line with the "eval" is the reason for "try".
                /** The source data variable in its original form, i.e. eval(sourceName)*/
                const sourceData = eval(sourceName);            //if sourceData == undefined, goto next iteration (because inside try)
                /** 
                 * The source data in array format. It contains the (single) values, objects, other arrays, etc, to be replaced inside HTML.
                 * Alternatively, if sourceWasObject==true, it is/contains the object keys of an object (!) to be evaluated. 
                */ 
                let DataArray = [];
                /** The "template" is the element's original HTML. It must not change value */
                const template = element.innerHTML;     
                element.innerHTML = '';
                /** boolean, if data was object */
                let sourceWasObject = false;

                // first, we want to construct DataArray as an array, with data from sourceData!  
                // 1st case: already an array
                if (Array.isArray(sourceData)) {          
                    DataArray = sourceData;
                // 2nd case: it is an Object        
                } else if (typeof(sourceData)==='object') {     
                    try {       //DataArray will be sourceData's keys 
                        DataArray = Object.keys(sourceData);
                        sourceWasObject = true;
                    }catch{}  
                // 3rd case: single variable  (or something weird or invalid)
                } else {                        //replace entire HTML and exit iteration
                    try{element.innerHTML = sourceData}catch{}  
                    return;         //return inside forEach, exits the function inside forEach, so it goes to next forEach iteration! 
                }
                
                // certainly DataArray is an array now! But it can be an array of single values, an array of arrays, an array of objects, or an array of object keys!
                DataArray.forEach((record, recordIndex)=>{
                    /** The html to be inserted/appended. It is a copy of the template that will be replaced. */
                    let newHTML = template;  

                    // 1st case: if record is array
                    if (Array.isArray(record)) {          
                        record.forEach((value,index) => {       //replace {{n}} or {{identifier[n]}} with the value
                            newHTML = identifier ? newHTML.replaceAll(`{{${identifier}[${index+1}]}}`,value) : newHTML.replaceAll(`{{${index+1}}}`,value);
                        });
                    
                    // 2nd case: if record is object
                    } else if (typeof(record)==='object') {    
                        for (const property in record) {newHTML = newHTML.replaceAll(`{{${property}}}`, record[property])}      //for-of will be a mess here...

                    // 3rd case: if record is single string, number etc. But it could have come from object keys (so DataArray is an array of keys/strings)
                    } else {        
                        //eg: {{key[n]}}. In this weird case, it is an Object key which has an array for a value. Needs evalVariables later.
                        if (identifier) {newHTML = newHTML.replaceAll(MLexp.withIndex(identifier), `<span data-variable>${sourceName}['{{${identifier}}}'][$1]</span>`); }
                        //This is the normal case. replace {{0}}, {{key}} or custom {{identifier}} with the value
                        newHTML = newHTML.replaceAll( (identifier ? `{{${identifier}}}` : MLexp.default), record); 
                        if (sourceWasObject) { newHTML = newHTML.replaceAll('{{value}}', sourceData[record]) }  
                    }         
                    
                    // in every case
                    newHTML = newHTML.replaceAll(MLexp.array,recordIndex).replaceAll('{{counter}}',recordIndex+1);  
                    
                    // finally, append the item
                    OutputBlocks.push(newHTML);
                    // element.innerHTML += newHTML;
                    this.evalVariables(element);     

                });     // end of "forEach" population
                element.innerHTML = OutputBlocks.join(separator);

            }catch{         // wrong attribute/array (no source variable), so delete attribute!
                element.removeAttribute('data-source');
                element.removeAttribute('data-identifier');
            }   
            
        };      // end of populateElement function

        // run iterations and populate html
        for (let iteration = 1; (iteration <= nestedLevels) && (document.querySelectorAll('[data-source]').length > 0); iteration++) {   
            document.querySelectorAll('[data-source]').forEach(populateElement);    
        } 

        // Finally, clear the rest (e.g. deep nested, beyond scope)!
        document.querySelectorAll('[data-source]').forEach(element=>{element.remove()});

        // Just to return something
        return DataSources;
    },



    /** evaluate when data-variable exists. Use evalVariables() or evalVariables(document.querySelector('#thatDiv'))  */
    evalVariables: function(element=document, keepAttribute=false) {
        let elementList = element.querySelectorAll('[data-variable]');
        elementList.forEach(e => {
            try{e.innerText = eval(e.innerText)}catch{}
            if (!keepAttribute) {e.removeAttribute('data-variable')}
        })
        return elementList;
    },

    /** Update an HTML element when the source changes value */
    update: function(elementID){
        let element = document.getElementById(elementID);
        element.outerHTML = this.originalElements[elementID];
        this.populate();
        return element;
    }


};      // end of object

}       // end of local block

dimML.populate(window?.dimMLnestedLevels ?? 1);  // jshint ignore:line