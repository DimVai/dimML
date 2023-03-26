# dimML.js
## HTML Template engine. Separate your structure from your data.
A template JS plug-in to separate your structure from your data. It is like AppML, but more simple to use, more flexible, and with support for nested elements. 
It can populate either Arrays or Objects. These can contain other (nested) Arrays or Objects! 
 
## By Dimitris Vainanidis (c) 2021. #

<br/>

<hr>
<hr>

# **How to use - Summary of the procedure**

1. Start by loading ```dimML.js``` to your page. The recommended way is to use `defer`. In the general case, it must be executed after the HTML content AND the required JavaScript data have been loaded.

```HTML
    <script defer src="https://dimvai.github.io/dimML/dimML.js"></script>
```
2. Then, in your HTML, use the `data-source="DataName"` attribute in the parent element to specify the data (JavaScript variable, object or array) to populate. Also, use the notation `{{variable}}` ("double curly brackets") as the placeholders for the data in the elements HTML. Below, there are a lot of examples that show how to do this step, here is just a summary. Note that the inner HTML of the div/span that has the `data-source` attribute is the thing will be repeated for every data element.

3. If you have nested data, you can use `var dimMLnestedLevels=3` to define that you have nested structure of depth 3. Below, there are more details. 


## *Note:* 
If your data doesn't get populated, the problem is usually that the above code tries to execute before HTML has been loaded or before the JavaScript variables/arrays/objects that contain the data have been loaded. That's why `defer` is prefered. (If anything fails, and you can't get your scripts to work in order, you can always run the dimML script with the command `dimML.populate()` at any moment, for example, when you make sure that everything has been loaded).

<hr>
<hr>

# **1. Examples with simple cases**

## **1.1 Single Variable**

This is the simplest case. In this example we simply display a JavaScript variable, without anything to get repeated.

 Use `data-source` and the innerText of your div/span will display the value of the variable you provide
```HTML
    <script>
        let authorName = 'Dimitris'
    </script>

    <span data-source="authorName"></span>
```
The result converts to :
```HTML
    <span>Dimitris</span>
```
with displayed output: 
```
    Dimitris
```
## *Note:* 
Only in this case of a single simple variable (not array or object) the **entire** innerText of the span will be overwritten. 


<hr>

## **1.2 Array of strings**

For a simple array of strings, use `data-source` to specify the array name and `{{0}}` for the placeholder.  


```HTML
    <script>
        let fruits = ['an apple', 'a banana', 'an orange']
    </script>    
    
    <ul data-source="fruits">
        <li>I have {{0}} to eat!</li>
    </ul>   
```
The result is:

> * I have an apple to eat!
> * I have a banana to eat!
> * I have an orange to eat!

## *Note:* 
The inner content of the div/span that has the `data-source` attribute, in this case the `li`, is what will get repeated. 

<hr>

## **1.3 Array of arrays**

For a simple array of strings, use `data-source` to specify the array name and `{{1}}`, `{{2}}` etc for the placeholders. The first element is the `{{1}}`, i.e. the base is `1` (not `0`).
```HTML
    <script>
        let fruits = [['apple','green'], ['banana','yellow'], ['orange','orange']]
    </script>    
    
    <p>My fruits:</p>
    <ul data-source="fruits">
        <li>My {{1}} has a {{2}} color</li>
    </ul>     
```
The result is:
> My fruits:
> * My apple has a green color
> * My banana has a yellow color
> * My orange has a orange color

## *Note:* 
You can also use `{{this}}` or `{{index}}` in order to return the (parent) array's index, but with base `0`. If, instead of base `0`, you want a counter with base `1` (eg. 1,2,3,), use `{{counter}}`. So, if you write:
```HTML
    <ul data-source="fruits">
        <li>[{{counter}}] My {{1}} has a {{2}} color</li>
    </ul> 
```
the result will be:
> * [1] My apple has a green color
> * [2] My banana has a yellow color
> * [3] My orange has a orange color

<hr>

## **1.4 Array of objects**

For a simple array of objects, use `{{key}}`, for every placeholder. We remind you that the inner HTML of the `data-source` is the content that gets repeated. 
```HTML
    <script>
        let fruits = [
            {fruitName:'apple',fruitColor:'green'}, 
            {fruitName:'banana',fruitColor:'yellow'}, 
            {fruitName:'orange',fruitColor:'orange'}
        ]
    </script>    
    
    <p>My fruits:</p>
    <ul data-source="fruits">
        <li>My {{fruitName}} has a {{fruitColor}} color</li>
    </ul>     
```
The result is:
> My fruits:
> * My apple has a green color
> * My banana has a yellow color
> * My orange has a orange color

Again and again: what is inside `data-source` is the thing that gets repeated. 

<hr>


## **1.5 Simple single Object that contains keys and values**

For simple Objects (Object of keys with values), use `{{0}}` or `{{key}}` for the key and `{{value}}` for the value:
```HTML
    <script>
        let fruits = {
            name:'apple',
            color:'green',
            taste:'nice'
        };
    </script>    

    <p>My fruits:</p>
    <ul data-source="fruits">
        <li>The {{key}} of my fruit is {{value}}!</li>
    </ul>      
```
The result is:
> My fruits:
> * The name of my fruit is apple!
> * The color of my fruit is green!
> * The taste of my fruit is nice!


<hr>
<hr>


# **2. Methods and Parameters**

## **2.1 Optional - Set nested levels**

If you have nested levels of data inside other data, use **one** of the following two commands **before** the `dimML.js` gets loaded/run (for example, in an inline script or on a "previous" .js file)

```JavaScript
    var dimMLnestedLevels = 3;
    window.dimMLnestedLevels = 3;
```
This is optional, the default parameter is `1`, and it is useful only if you have nested levels of data. For performance reasons, do not set this higher than it should be, although `dimML` is smart enough to stop running in most cases. If anything fails, you can always re-run the dimML by:
```JavaScript
    dimML.populate(n)       // n is the number of nested levels
```

## **2.2 Update elements when your data changes**
```JavaScript
    dimML.update(elementID);
```
If your data ever changes, use the `dimML.update()` method to re-populate your data in this element. Of course, you must have an id on this HTML element for `update` to work:
```HTML
    <ul id="myLife" data-source="Life">
        <!--Template-->
    </ul>
```
In this example, if the Object/Array `Life` changes, in order to update this element with the new data, run 
```JavaScript
dimML.update('myLife')
```
<hr>
<hr>

# **3. Identifiers and Separators**

## **3.1 Identifiers**
The `data-identifier` attribute is very useful when you want to have nested cases. You can see examples below. In the simple cases, this is not required, and can only be used to make your HTML code look more *easily comprehensible / understood*. So, instead if using `{{0}}`, you can give your variables a name using `{{identifier}}`:

```HTML
    <script>
        let myTraits = ['Nice', 'Sexy', 'Witty']
    </script>

    <ul data-source="myTraits" data-identifier="trait">
        <li>One of my traits is: {{trait}}</>
    </ul>
```

The output is:
> * One of my traits is: nice
> * One of my traits is: sexy
> * One of my traits is: witty

<hr>

## **3.2 Separators**
The `data-separator` is used when you want to specify a "separator" between your repeated blocks of text. The most common of these is the comma separator `", "` so we use it as an example here:

```HTML
    <script>
        let myTraits = ['nice', 'sexy', 'witty']
    </script>

    <p>My traits are 
        <span data-source="myTraits" data-separator=", ">{{0}}</span>.
    </p>
```

The output is separated by comma:
> My traits are nice, sexy, witty.


<hr>
<hr>

# **4. Examples with nested cases**

## **4.1 Basic example of nested things**

When you use nested elements, a nice thing to use is the `data-identifier` attribute. It is used, so the `{{0}}` of the different nested objects/arrays are not being mixed up / overridden. In this attribute you state how you want to call the element's children in the template. So, you can use `{{newName}}`, instead of `{{0}}` in this case. 

To nest things, use  `data-source="{{upper}}"` to point to the "upper" thing. With that being said:


```HTML
 <script>
     let friends = ['John', 'Cate', 'Silvia']
     let John = ['tall', 'smart']
     // not declaring Cate on purpose...
     let Silvia = ['blonde', 'beautiful','witty']
 </script>
 
<p>My friends</p>
<ul data-source="friends" data-identifier="friend">
    <li>
        My friend, {{friend}}, has these traits:  
        <span data-source="{{friend}}" data-identifier="trait" data-separator=", ">{{trait}}</span>
    </li>
</ul>
```
The result is:

> My friends:
> * My friend, John, has these traits: tall, smart
> * My friend, Cate, has these traits: {{trait}}
> * My friend, Silvia, has these traits: blonde, beautiful, witty

## *Note:* 
1. Notice that because there is not a `Cate` array, the output is the *unchanged* {{trait}} in order to indicate that `Cate` was not found. In order to fix that, you can simply have `let Cate = []`, so the output will be empty. 
2. Remember to set `var dimMLnestedLevels = 3` before `dimML.js` runs! 
3. Again and again and again: what is inside `data-source` is the thing that gets repeated.
<hr>


## **4.2 Object that contains keys and "array" values**

For an Object with "array" values (its is an extension of a previous case), use `data-identifier="section"`, so its immediate children will be called `section`, to separate its grand-children which will be called `category`. So the nested sub-list will have the `data-source="Life['{{section}}']"` which is an array, so it can be iterated using the  `data-source` attribute. Notice, that in the nested sub-list, we can display also the `section` variable.
```HTML
<script>
    const Life = { 
        "Health and Security": ["Health","Safety and Security"],
        "Wealth":["Financial Strategy","Work","Investments","Products & Services"],
        "Relationships": ["Self Image","Family","Sexual","Social"],
        "Lifestyle": ["Everyday Life","Productivity","Improvement","Hobbies"]
    };
</script>

<p>Life:</p>
<ul data-source="Life" data-identifier="section">
    <li>{{section}}
        <ul data-source="Life['{{section}}']" data-identifier="category">
            <li>{{section}} - {{category}}</li>
        </ul>
    </li>
</ul>     
```
The result is:
> Life:
> * Health and Security
>   + Health and Security - Health
>   + Health and Security - Safety and Security
> * Wealth
>   + Wealth - Financial Strategy
>   + Wealth - Work
>   + Wealth - Investments
>   + Wealth - Products & Services
> * Relationships
>   + Relationships - Self Image
>   + Relationships - Self Image
>   + Relationships - Sexual
>   + Relationships - Social
> * Lifestyle
>   + Lifestyle - Everyday Life
>   + Lifestyle - Productivity
>   + Lifestyle - Improvement
>   + Lifestyle - Improvement

<hr>

## **4.3 Object with triple nested elements!!!**

An extension of the previous example. Here, `ExtendedLife` is an Object that contains objects that contain other objects that contain arrays! Enough comments! Enjoy!

Source HTML:

```HTML
<script>
    const ExtendedLife = { 
            "Health and Security": {
                "Health":["Nutrition","Physical activity","Health monitoring"],
                "Safety and Security":["Physical security","Self-defence","Disaster handling"]
            },
            "Relationships": {        
                    "Self Image":["Self image","Style and Character","Online social networks"],
                    "Sexual":["Attraction & Success","Relationship management"]
            }
        };
</script>

<p>ExtendedLife</p>
<ul data-source="ExtendedLife" data-identifier="section">
    <li>{{section}}
        <ul data-source="ExtendedLife['{{section}}']" data-identifier="category">
            <li>{{section}} - {{category}}</li>
            <ul data-source="ExtendedLife['{{section}}']['{{category}}']" data-identifier="activity">
                <li>{{section}} - {{category}} - {{activity}} </li>
            </ul>
        </ul>
    </li>
</ul>  
```

Result:
> ExtendedLife:
> * Health and Security
>   + Health and Security - Health
>       - Health and Security - Health - Nutrition
>       - Health and Security - Health - Physical activity
>       - Health and Security - Health - Health monitoring
>   + Health and Security - Health
>       - Health and Security - Safety and Security - Physical security
>       - Health and Security - Safety and Security - Self-defence
>       - Health and Security - Safety and Security - Disaster handling
> * Relationships
>   + Relationships - Self Image
>       - Relationships - Self Image - Self image
>       - Relationships - Self Image - Style and Character
>       - Relationships - Self Image - Online social networks
>   + Relationships - Sexual
>       - Relationships - Sexual - Attraction & Success
>       - Relationships - Sexual - Relationship management



<hr>
<hr>

# **5. Weird Cases (avoid them if you can)**


## **5.1 Array that contains Arrays that contain arrays**

Notice that the base is not consistent yet!!! In the element's body, `{{1}}` is the first element of the array, i.e. the base is `1`. Instead, in the `data-source` attribute, the base is the original Javascript base, i.e. `0`, so the first element is `{{0}`. Sorry about that! I am going to fix that in some next version... 

So, you can use `{{this}}` which is going to take as a value the current index (i.e.,0,1,2) in every iteration. So, the `SmallLife[{{this}}][1]"` will be an array, so it can be iterated using the `data-source` attribute. 

```HTML
<script>
    const SmallLife = [
    [
        "Health and Security", 
        ["Health","Safety and Security"],
        "health-link"
    ],
    [
        "Relationships", 
        ["Self Image","Sexual"],
        "relationships-link"
    ]
];
</script>

<p>SmallLife</p>
<ul data-source="SmallLife" data-identifier="section">
    <li>
        {{section[1]}} - [{{section[3]}}]
        <ul data-source="SmallLife[{{this}}][1]" data-identifier="category">
            <li>{{section[1]}} - {{category}}</li>
        </ul>
    </li>
</ul>
```

Result:
> SmallLife:
> * Health and Security - [health-link]
>   + Health and Security - Health
>   + Health and Security - Safety and Security
> * Relationships - [relationships-link]
>   + Relationships - Self Image
>   + Relationships - Sexual


<hr>

## **5.2 Object that contains keys and "arrays with arrays" values**

In the following case, `ComplexLife["Health and Security"][0]` is the array `["Health","Safety and Security"]`. In the general case, the `ComplexLife['{{section}}'][0]`, as an array, it can be iterated using the `data-source` attribute. Again, the base in `{{section[1]}}` is not consistent at this moment, so you need to experiment (sorry again!). So: 

```HTML
<script>
    const ComplexLife = { 
        "Health and Security": [["Health","Safety and Security"],'health-link'],
        "Relationships": [["Self Image","Sexual"],'relationships-link'],
    };
</script>

<p>ComplexLife</p>
<ul data-source="ComplexLife" data-identifier="section">
    <li>
        {{section}}, [{{section[1]}}]
        <ul data-source="ComplexLife['{{section}}'][0]" data-identifier="categoryArray">
            <li>{{section}} - {{categoryArray}}</li>
        </ul>
    </li>
</ul>
```

Result:
> ComplexLife:
> * Health and Security, [health-link]
>   + Health and Security - Health
>   + Health and Security - Safety and Security
> * Relationships, [relationships-link]
>   + Relationships - Self Image
>   + Relationships - Sexual

The above result can be obtained also with another way, using the fact that that `ComplexLife['{{section}}'][1]` is a single variable (not an array), so we can use `data-variable`:
```HTML
<p>ComplexLifeAlternative</p>
<ul data-source="ComplexLife" data-identifier="section">
    <li>
        {{section}}, [<span data-variable>ComplexLife['{{section}}'][1]</span>]
        <ul data-source="ComplexLife['{{section}}'][0]" data-identifier="categoryArray">
            <li>{{section}} - {{categoryArray}}</li>
        </ul>
    </li>
</ul>
```

<hr>
<hr>

# **All commands, attributes & methods associated with dimML**

HTML attributes:
```Javascript
data-source="variable/array/object"
data-identifier="newNameOfItem"
data-separator="separator"
```
HTML placeholders to be replaced:
```JavaScript
{{0}}                   // when source is a simple array of values
{{1}} {{2}} ...         // when source is an array of arrays
{{this}} {{index}}      // will be replaced with array's index
{{count}}               // will be replaced with array's index+1
{{objectProperty}}      // [custom property] when source is an array of objects
{{key}} {{value}}       // when source is an object
{{identifier}}          // [custom identifier] to use in nested cases
{{category[index]}}     // [custom identifier with index] in weird nested cases
```
JavaScript dimML commands and methods:
```JavaScript
var dimMLnestedLevels = n;          // set nested levels before dimML runs
dimML.populate(nestedLevels=1);     // call with optional nested depth
dimML.update(elementId)             // update a specific element
```


<hr>
<hr>

# **Enjoy!**


