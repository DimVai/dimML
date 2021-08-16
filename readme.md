# dimML.js
## HTML Template engine. Separate your structure from your data.
A template JS plug-in to separate your structure from your data. Like AppML, but more simple to use, more flexible, and with support for Nested elements. 
It can populate either Arrays or Objects. These can contain other Arrays or Objects! 
 
## By Dimitris Vainanidis (c) 2021. #

<br/>

<hr>
<hr>

# **Initial note**


I did not bother to write full documentation for this. Just study the examples, and you will understand what you need. Only If you need something special, I mention it below.

Start by loading the  ```dim-ML``` script to your page:
```HTML
 <script defer src="https://dimvai.github.io/dim-ML/dim-ML.js"></script>
```
Then use the `data-variable` or `data-source` attribute to specify the Data (JavaScript variable, object or array) to populate.
<hr>
<hr>

# **1. Examples with simple cases**

## **1.1 Single Variable**

Use `data-variable` and the inner Text of your div/span will display the value of the variable you provide
```HTML
    <script>
        let authorName = 'Dimitris'
    </script>

    <div data-variable>authorName</div>

```
The result converts to :
```
    <div>Dimitris</div>
```
with output: 
```
    Dimitris
```


<hr>

## **1.2 Array of strings**

For everything else, use `data-source`. 

For a simple array of strings, use `data-source` to specify the array name and `{{0}}` for the placeholder.  The inner HTML of the div/span that has the `data-source` attribute, is what will be repeated. 
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
You can also use `{{this}}` or `{{index}}` in order to return the (parent) array's index, but with base `0`. If, instead of base `0`, you want a counter with base `1` (eg. 1,2,3,), use `{{count}}`. So, if you write:
```HTML
    <ul data-source="fruits">
        <li>[{{Count}}] My {{1}} has a {{2}} color</li>
    </ul> 
```
the result will be:
> * [1] My apple has a green color
> * [2] My banana has a yellow color
> * [3] My orange has a orange color

<hr>

## **1.4 Array of objects**

For a simple array of objects, use `{{key}}`, for every placeholder.
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


# **2. dimML methods and parameters**

## **2.1 Set Nested Levels**
```JavaScript
    var dimMLnestedLevels = 1;
```
**Optionally** execute the above command to manually declare how many levels deep your nested data elements are (read below for nested cases). This command is optional and it is useful only:
* If you have more than `3` nested levels of data (3 is the default levels if you don't set anything) 
* For performance reasons, but *only* in the weird case you have *wrongly* set your `data-source` attributes, and you need a security pillar. In  this weird case, a larger than needed number, may will cause degradation of performance when your page loads, because `dimML` will iterate your page without doing anything useful.  So, use the lowest number that works in your case. However, if your HTML template (the HTML inside `data-source`) is set *correctly*, there is no need to set anything (`dimML` is programmed not to iterate further if it has finished populating the data). 

Execute this on your custom .js file or in your HTML inline script, but certainly **before** dimML.js loads.

## **2.2 Update elements when your data changes**
```JavaScript
    dimML.update(elementID);
```
If your data ever changes, use this `dimML.update` command to re-populate your data in this element. Of course, you must have an id on this HTML element for `update` to work:
```HTML
    <ul id="myLife" data-source="Life" data-identifier="section">
        <!--Template-->
    </ul>
```
In this example, if the Object/Array `Life` changes, in order to update this element with the new data, use 
```JavaScript
dimML.update('myLife')
```

# **3. Examples with nested cases**

## **3.1 Basic example of nested things**

When you use nested elements, a nice thing to use is the `data-identifier` attribute. It is used, so the `{{0}}` of the different nested objects/arrays are not being mixed up / overridden. In this attribute you state how you want to call the element's children in the template. So, you can use `{{newName}}`, instead of `{{0}}` in this case. 

To nest things, use  `data-source="{{upper}}"` to point to the "upper" thing. With that being said:


```HTML
 <script>
     let friends = ['John', 'Cate', 'Silvia']
     let John = ['tall', 'smart']
     let Silvia = ['blonde', 'beautiful','witty']
 </script>
 
<p>My friends</p>
<div data-source="friends" data-identifier="friend">
    <ul>
        <li>
            My friend, {{friend}}  
            <span data-source="{{friend}}" data-identifier="trait"> has these traits: {{trait}} </span>
        </li>
    </ul>
</div>
```
The result is:
> My friends:
> * My friend, John, has these traits: tall, smart
> * My friend, Cate, has these traits:
> * My friend, Silvia, has these traits: blonde beautiful witty

Notice that because there is not a `Cate` array, the output is clear (without errors or ugly `{{things}}`). 
<hr>


## **3.2 Object that contains keys and "array" values**

For an Object with "array" values (its is an extension of a previous case), use `data-identifier="section"`, so its immediate children will be called `section`, to separate its grand-children which will be called `categories`. So the nested sub-list will have the `data-source="Life['{{section}}']"` which is an array, so it can be iterated using the  `data-source` attribute. Notice, that in the nested sub-list, we can display also the `section` variable.
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
    <li>
        {{section}}
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

## **3.3 Object with triple nested elements!!!**

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
    <li>
        {{section}}
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

# **4. Weird Cases**


## **4.1 Array that contains Arrays that contain arrays**

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

## **4.2 Object that contains keys and "arrays with arrays" values**

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


# **Enjoy!**

