# CLASSIFIED

Moduler css framwork

Ever wanted to write a quick prototype? Classified helps you finish prototypes quickly without the need to write any line of CSS, it provides you with all the CSS classes that you need to create that page. 

# Building from source
 clone this repo and follow these steps.
 
 - enter to the project directory

 ```sh
  > $ cd classified
 ```
 - Install the dependencies
  ```sh
 > $ npm install
 ```
 
 - Build the project
 ```sh
 > $ grunt
 ```
 compiled files will be found inside the dist folder
 
# Installation
  - Download the project from classfied.org, or from this repo
  - include the classified.css or classified.css.min to your html page
   ```html
  <link href="css/classified.css" rel="stylesheet"> 
  ```

# Usage
To use classified all you need is to add the class you want to the html elements

for example to add a 10px margin top to a specific div:
```html
 <div id="foo" class="margin-top-10">bar</div>
```
to add a 10px padding to the same div:

```html
 <div id="foo" class="margin-top-10 padding-10">bar</div>
```

to add a 1px solid border to the div, 

```html
 <div id="foo" class="margin-top-10 padding-10 border-1 border-style-solid ">bar</div>
```

to add a 10px border radius to the div, 

```html
 <div id="foo" class="margin-top-10 padding-10 border-1 border-style-solid border-radius-10 ">bar</div>
```

The above example will give you a div with the following css
```css
 margin-top: 10px;
 padding: 10px;
 border: 1px;
 border-style: solid;
 border-radius: 10px;
```

Each css property have its corresponding css class, also each class have a short hand which you can use instead of writing the full class name.

the shorthands have the following naming convention:
>[a]bc - [d]efg [-..xyz] 

for example the border-top-style-solid class will have a shorthand
> bts-solid,  /* [b]order-[t]op-[s]tyle[-solid]

so the above div example using the shorthands will be:
```html
Without shorthand classes
<div id="foo" class="margin-top-10 padding-10 border-1 border-style-solid border-radius-10 ">bar</div>

With shorthand classes
 <div id="foo" class="mt-10 p-10 b-1 bs-solid br-10 ">bar</div>
```

### Version
1.0.0

License
----

MIT


**Free Software, Hell Yeah!**

# Contributors
Waleed Qadi: http://github.com/waleedq

Karam Melkon: http://github.com/kmelkon
