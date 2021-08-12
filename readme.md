# dimML.js
## HTML Template engine. Separate your structure from your data.
A template JS plug-in to your structure from your data (AppML style), more simple to use, ore flexible, and with support to Nested elements. 
It can populate Arrays or Objects. These can contain either Arrays or Objects! 
 
## By Dimitris Vainanidis (c) 2021. #

<br/>

<hr>
<hr>

# **Initial note**


I did not bother to write full documentation for this. Just study the examples, and you will understand what you need. Only If you need something special, I mention it below.

Start by loading the  ```dim-ML``` script to your page:
```HTML
 <script defer src="dim-ML.js"></script>
```
Then use the `data-variable` attribute to specify the Data to populate. The Data must be an JavaScript Array or a Javascript Object.
<hr>
<hr>

# **1. Examples with simple cases**

## **Single Variable**

Use `data-variable` and the inner Text of your div/span will display the value of the variable you provide
```HTML
    <script>
        let authorName = 'Dimitris'
    </script>

    <div data-variable>authorName</div>

```
The result is:
```
Dimitris
```


<hr>

## **Array of strings**

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

## **Array of arrays**

For everything else, use `data-source`.

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


<hr>

## **Array of objects**

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


## **Simple Object that contains keys and values**

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

# **2. Examples with nested cases**

## **Basic example of nested things**

When you use nested elements, a nice thing to use is the `data-identifier` attribute. It is used, so the `{{0}}` of the different nested objects/arrays are not being mixed up / overridden. This attribute declares how you want to call its children in the template. So, you can use `{{newName}}` instead of `{{0}}` in this case. 

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

Notice that because there is not `Cate` array, the output is clear (without errors or ugly `{{things}}`). 
<hr>


## **Object that contains keys and "array" values**

When you use nested elements, a nice thing to use is the `data-identifier` attribute. It is used, so the `{{0}}` of the different nested objects/arrays are not being mixed up / overridden. This attribute declares how you want to call its children. So, you use `{{newName}}` instead of `{{0}}` in this case. With this being said.... 

For an Object with "array" values (its is an extension of the previous case), use `data-identifier="section"`, so its immediate children will be called `section`, to separate its grand-children which will be called `categories`. So the nested sub-list will have the `data-source="Life['{{section}}']"`. Notice, that in the nested sub-list, we can display also the `section` variable.
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

## **Object with triple nested elements!!!**

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

# **3. Weird Cases**


## **Array that contains Arrays**

Notice that the base is not consistent yet!!! In the element's body, `{{1}}` is the first element of the array, i.e. the base is the `1`. Instead, in the `data-source` attribute, the base is the original Javascript base, i.e. `0`, so the first element is `{{0}`. Sorry... 

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
> * Health and Security - [click this link: health-link]
>   + Health and Security - Health
>   + Health and Security - Safety and Security
> * Relationships - [click this link: relationships-link]
>   + Relationships - Self Image
>   + Relationships - Sexual


<hr>

## **Object that contains keys and "arrays with arrays" values**

In the following case, `ComplexLife["Health and Security"][0]` is the array `["Health","Safety and Security"]`. In the general case, the `ComplexLife['{{section}}'][0]`, as an array, it can be iterated using `data-source`. So: 

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

The above result can be obtained also with another way, given that `ComplexLife['{{section}}'][0]` is a simple variable (not an array), so we can use `data-variable`:
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

