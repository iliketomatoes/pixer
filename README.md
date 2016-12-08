# Pixer

Automatically generate pixelated gradient between two block elements.

## Getting started

Download this plugin from the Github repository or install it through this command:

```
$ npm install pixer --save
```

This library is also available through Bower package manager:

```
$ bower install pixer --save
```

## Required assets

Set some CSS rules for the canvas elements we are going to use.
These are some **suggested** classes:

```css
.js-pixer {
	width: 100%;
	height: 80px;
}

.js-pixer--big {
	width: 100%;
	height: 120px;
}

.js-pixer--small {
	width: 100%;
	height: 40px;
}
```

Import the Pixer library:

```html
<script src="path/to/dist/pixer.js"></script>
```

## Required markup

Just put a canvas element having the *data-pixer* attribute in between the two block elements
you want to apply the pixelated border to.
It's mandatory to set a CSS property for the background of the two target elements:
```html

<!-- target 1 -->
<div style="background:<COLOR>"></div>

<!-- the pixelated gradient border will be generated inside this canvas -->
<canvas data-pixer class="js-pixer"></canvas>

<!-- target 2 -->
<div style="background:<ANOTHER COLOR>"></div>
```

## Start it up

This Javascript library is UMD compliant, so you can consume it even like this:

```javascript
	var pixer = require('pixer');

	// Call the init function which returns the API object handler
	var pixerApi = pixer();
```
Or just get the global object bound to the window:

```javascript
	var pixer = window.pixer;

	// Call the init function which returns the API object handler
	var pixerApi = pixer();
```

## Set some options

At the moment the only customizable setting is the number of stripes that the
pixelated border will be formed of.
The default amount of stripes is **4**.

You can set the custom amount of stripes by passing a valid JSON object into the
*data-pixer* attribute:

```html
<div id="target-1" style="background:<COLOR>"></div>
<canvas data-pixer='{"stripes":"4"}' class="js-pixer"></canvas>
<div id="target-2" style="background:<ANOTHER COLOR>"></div>
```


## API

Available methods:

```javascript
	var pixerApi = pixer();

	// Reflow all the pixelated borders in the page
	pixerApi.reflowAll();

```

## AUTHORS
Giancarlo Soverini <giancarlosoverini@gmail.com>

## LICENSE
AGPL-3.0
