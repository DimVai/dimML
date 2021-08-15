/**
 * @file dim-ML.js
 * @author Dimitris Vainanidis,
 * @copyright Dimitris Vainanidis 2021
 */

/* jshint unused:false , strict:global , esversion: 10, evil:true, asi:true */
"use strict"; 


{               //block, so "let" variables will not be public

   
/** Returns the keys of an object in an array */
let keysOf = (object) => {return Object.keys(object);}
/** write log, instead of console.log */
let log = console.log;
/** The RegExp that indicates the string that will be replaced by some value. It has the format: {{anything}} */
let MLdefaultExp = /\{\{(0|key)\}\}/g;
let MLexp = /(\{\{.*\}\})/;
//Important: do not do /g in the regex above! Because it changes if you executed (using "test" method) twice!
//https://stackoverflow.com/questions/6891545/javascript-regexp-test-returns-false-even-though-it-should-return-true
let MLexpArg = letter => {return new RegExp(`\\{\\{${letter}\\[(\\d)\\]\\}\\}`,'g')};

/** The dimML Object */
var dimML = {

    /** Stores the original outerHtML of elements, so as to be updated later */
    originalElements: {},

    /**
     * Execute the dimML job
     * @param {number} nestedLevels The maxumum number of levels to go deep
     */
    populate: function(nestedLevels = 3){

        /** system iteration variable */
        let iteration = 1;

        while (iteration <= nestedLevels && document.querySelectorAll('[data-source]').length > 0) {   

            //log({iteration})   
            document.querySelectorAll('[data-source]').forEach((element)=>{             // jshint ignore:line
                
                /** The name of the data array as a string */
                const dataSourceName = element.attributes['data-source'].value;
                //log(dataSourceName)
                const identifier = element.getAttribute('data-identifier')||"";

                //store element to dimML.originalElements so it can be updated later
                if (element.id) {this.originalElements[element.id] = element.outerHTML } 

                //if data-source="{{something}}", do nothing - maybe do something on next iteration (nested). 
                if (MLexp.test(dataSourceName)) {
                // log('stop'); 
                    return;
                } else {            //Else (if you are going to do something, replace or delete), delete attributes!
                // log('to be replaced or deleted');
                    element.removeAttribute('data-source');
                    element.removeAttribute('data-identifier')
                }

                
                
                //log(element.outerHTML)         //if debugging, ανέβασέ το
                /** The "template" is the original html. It must not change value */
                const template = element.innerHTML;     
                element.innerHTML = '';
                /** boolean, if data was object */
                let DataWasObject = false;

                try{
                    //Now, we want the array!
                    //eval converts string to variable name (eg: 'pets' string => pets array). This line with the "eval" is the reason for "try".
                    /** The data in its original form */
                    const DataSource = eval(dataSourceName);
                    /** The data in an array form */ 
                    let DataArray = [];

                    //first, we want to construct DataArray as an array, with data from DataSource!  
                    //1st case: already an array
                    if (DataSource.constructor == Array) {          //
                            DataArray = DataSource;
                    //2nd case: it is an Object        
                    } else if (typeof(DataSource) === 'object') {     
                        try {       //DataArray will be DataSource's keys 
                            DataArray = keysOf(DataSource);
                            DataWasObject = true;
                        }catch{}  
                    //3rd case: single "prototype" variable  (or something weird or invalid)
                    } else {                        //replace entire HTML and exit iteration
                        try{element.innerHTML = DataSource}catch{}  
                        return;         //return inside forEach, exits the function inside forEach, so it goes to next forEach iteration! 
                    }    

                    //certainly DataArray is an array now!
                    //log(DataArray);
                    DataArray.forEach((record, recordIndex)=>{
                        /** The html to be inserted/appended. It is a copy of the template that will be replaced. */
                        let newHTML = template;  

                        //1st case: if record is array
                        if (record.constructor == Array) {      
                            record.forEach((value,index) => {       //replace with {{n}} or custom data-identifier {{identifier[n]}}
                                newHTML = identifier ? newHTML.replaceAll(`{{${identifier}[${index+1}]}}`,value) : newHTML.replaceAll(`{{${index+1}}}`,value);
                            });
                        
                        //2nd case: if record is object
                        } else if (typeof(record) === 'object') {    
                            for (const property in record) {newHTML = newHTML.replaceAll(`{{${property}}}`, record[property])}

                        //3rd case: if record is single string, number etc. But it could have come from object keys (so DataArray is an array of keys/strings)
                        } else {        
                            //eg: {{key[n]}}. In this weird case, it is an Object key which has an array for a value. Needs evalVariables later.
                            if (identifier) {newHTML = newHTML.replaceAll(MLexpArg(identifier), `<span data-variable>${dataSourceName}['{{${identifier}}}'][$1]</span>`); }
                            //This is the normal case. replace with {{0}}/ {{key}} or custom data-identifier. 
                            newHTML = newHTML.replaceAll( (identifier ? `{{${identifier}}}` : MLdefaultExp), record); 
                            if (DataWasObject) { newHTML = newHTML.replaceAll('{{value}}', DataSource[record]) }  
                        }         
                        
                        newHTML = newHTML.replaceAll(`{{this}}`,recordIndex);  
                        
                        //finally, append the item
                        element.innerHTML += newHTML;
                        this.evalVariables(element);     
                    });

                }catch{         //wrong attribute/array (no dataSourceName variable), so delete attribute!
                    element.removeAttribute('data-source');
                    element.removeAttribute('data-identifier');
                }     
                //log(element.outerHTML); 
            });
            iteration++;
        }

        //Finally, clear the rest!
        document.querySelectorAll('[data-source]').forEach(element =>{
            element.remove();
        });
    },



    /** evaluate when data-variable exists. Use evalVariables() or evalVariables(document.querySelector('#thatDiv'))  */
    evalVariables: function(element=document, keepAttribute=false) {
        element.querySelectorAll('[data-variable]').forEach(e => {
            try{e.innerText = eval(e.innerText)}catch{}
            if (!keepAttribute) {e.removeAttribute('data-variable')}
        })
    },

    update: function(elementID){
        document.getElementById(elementID).outerHTML = this.originalElements[elementID];
        this.populate();
    }


};      //end of object


let defaultNestedLevels = 3;  
var dimMLnestedLevels;
//if user has not set this manually, set to 3 (defaultNestedLevels) 
dimMLnestedLevels ??= defaultNestedLevels;       // jshint ignore:line

}       //end of local block



dimML.evalVariables(document);


dimML.populate(dimMLnestedLevels);