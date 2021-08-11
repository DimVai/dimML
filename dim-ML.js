/**
 * @file dim-ML.js
 * @author Dimitris Vainanidis,
 * @copyright Dimitris Vainanidis 2021
 */

/* jshint unused:false , strict:global , esversion: 10, evil:true, asi:true */
"use strict"; 


let author = 'Dimitris';

let cloud = [
    {par: "rain", color:"blue"},
    {par: "snow", color:"white"},
    ["grass","green"],
    ["rain","red"],
    "text",
];
let rain = [{child:'water'},{child:'drops'}];
let snow = ['happiness','whiteness'];
let water = ['transparent'];
let drops = ['a wonderful level 3','a beautiful level 3']

let people = [
    ['dimitris','sexy'],['angel','nice']
]
let sexy = ['the desired attribute']
let good = ['very','goody']

let animals = [['pets'],['friends']]
let pets = {dog:['good','boy']}
let friends = {dog:['good','friend']}

const IdealCategorizationArray = [
    [
        "Health and Security", 
        [
            [
                "Health",
                ["Nutrition","Physical activity","Health monitoring"]
            ],
            [
                "Safety and Security",
                ["Physical security","Self-defence","Disaster handling"]
            ]
        ]
    ],
    [
        "Relationships", 
        [
            [
                "Self Image",
                ["Self image","Style and Character","Online social networks"]
            ],
            [
                "Sexual",
                ["Attraction & Success","Relationship management"]
            ]
        ]
    ]
]


const SmallCategorizationArray = [
    [
        "Health and Security", 
        ["Health","Safety and Security"]
    ],
    [
        "Relationships", 
        ["Self Image","Sexual"]
    ]
];


const SmallCategorizationObject = { 
    "Health and Security": ["Health","Safety and Security"],
    "Relationships": ["Self Image","Sexual"],
};


const MediumCategorizationObject = { 
        "Health and Security": {
            "Health":["Nutrition","Physical activity","Health monitoring"],
            "Safety and Security":["Physical security","Self-defence","Disaster handling"]
        },
        "Relationships": {        
                "Self Image":["Self image","Style and Character","Online social networks"],
                "Sexual":["Attraction & Success","Relationship management"]
        }
    };





var IdealCategorization = [
    {"Health and Security":[
        {"Health":
            ["Nutrition","Physical activity","Health monitoring"]
        },
        {"Safety and Security":
            ["Physical security","Self-defence","Disaster handling"]
        }
    ]},
    {"Relationships":[
        {"Self Image":
            ["Self image","Style and Character","Online social networks"]
        },
        {"Sexual":
            ["Attraction & Success","Relationship management"]
        }
    ]}
];





/** Returns the keys of an object in an array */
let keysOf = (object) => {return Object.keys(object);}
/** write log, instead of console.log */
let log = console.log;
/** The RegExp that indicates the string that will be replaced by some value. It has the format: {{anything}} */
let MLexp = /(\{\{.*\}\})/g;

/**
 * Execute the dimML job
 * @param {number} nestedLevels The maxumum number of levels to go deep
 */
function dimML(nestedLevels = 3){

/** system iteration variable */
let iteration = 1;

while (iteration <= nestedLevels && document.querySelectorAll('[data-source]').length > 0) {   

    log({iteration})   
    document.querySelectorAll('[data-source]').forEach((element)=>{             // jshint ignore:line
        /** The name of the data array as a string */
        const dataSourceName = element.attributes['data-source'].value;
        log(dataSourceName)
        
        //if data-source="{{something}}", do nothing - maybe on next iteration (nested). Else (if you do something), delete attribute!
        if (MLexp.test(dataSourceName)) {log('stop'); return} else {log('to be replaced');element.removeAttribute('data-source')}
        
        log(element.outerHTML)         //if debugging, ανέβασέ το
        /** The "template" is the original html. It must not change value */
        const template = element.innerHTML;       
        element.innerHTML = '';

        try{
            //Now, we want the array!
            //eval converts string to variable name (eg: 'pets' string => pets array). This line is the reason for "try".
            /** The data array */ 
            var DataArray = eval(dataSourceName);  

            //but first, we must ensure that it is an array!
            if (!Array.isArray(DataArray)) {            //if it is not an array, do something different.    
                if (typeof(DataArray) === 'object') {       //if object, convert its keys to array, so we can continue 
                    try{DataArray = keysOf(DataArray)}catch{}         
                } else {                        //if single "prototype" variable, replace entireHTML and exit iteration
                    try {element.innerHTML = DataArray}catch{}  
                    return;         //return inside forEach, exits the function inside forEach, so it goes to next forEach iteration! 
                }
            }

            //certainly DataArray is an array now!
            DataArray.forEach(record=>{
                /** The html to be inserted/appended. It is a copy of the template that will be replaced. */
                let newHTML = template;  

                //1st case: if array
                if (record.constructor == Array) {      
                    record.forEach((value,index) => {newHTML = newHTML.replaceAll(`{{${index+1}}}`,value)});
                    
                
                //2nd case: if object
                } else if (typeof(record) === 'object') {    
                    for (const property in record) {newHTML = newHTML.replaceAll(`{{${property}}}`, record[property])}

                //3rd case: if single string, number etc
                } else {          
                    newHTML = newHTML.replaceAll(                   //replace with {{0}} or custom data-identifier
                        (element.getAttribute('data-identifier') ? '{{'+element.getAttribute('data-identifier')+'}}' : '{{0}}'), 
                        record);
                }
                //finally, append the item
                element.innerHTML += newHTML;
            });

        }catch{element.removeAttribute('data-source')}     //wrong attribute/array (no dataSourceName variable), so delete attribute!
        log(element.outerHTML); 
    });
    iteration++;
}
//Now, clear the rest!
document.querySelectorAll('[data-source]').forEach(element =>{
    element.remove();
});
}
dimML(3);