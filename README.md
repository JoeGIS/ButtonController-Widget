# ButtonController-Widget

## Features
A  widget for creating a row of buttons and Dojo FloatingPanes that are toggled to open and close.

[View it live](http://joerogan.ca/maps/joegis/)

## Quickstart
```javascript
// ButtonController widget example
var buttonController = new ButtonController({
    theme: "customButton", 
    themeSelected: "customButtonSelected", 
    top: 20,
    left: 80,
    buttons: [{
        title: "Location", 
        image: "images/LocationButton.png", 
        window: {
            id: "LocationWindow", 
            title: "Location", 
            top: 50, left: 0}
        }, 
        {
        title: "Bookmarks", 
        image: "images/BookmarksButton.png", 
        window: {
            id: "BookmarksWindow", 
            title: "Bookmarks", 
            top: 50, left: 0}
        }, 
        {
        title: "Measurement", 
        image: "images/MeasurementButton.png", 
        window: {
            id: "MeasurementWindow", 
            title: "Measurement", 
            top: 50, left: 0, height: 125, width: 250}
        }, 
        {
        title: "Draw", 
        image: "images/DrawButton.png", 
        window: {
            id: "DrawWindow", 
            title: "Draw", 
            top: 50, left: 0}
        }]
    }, "ButtonControllerDiv");

// Startup the ButtonController, only after any widgets contained within it's windows that have dojo layout items (eg: tab containers) are created.
buttonController.startup();
```

## Requirements
* Notepad or HTML editor
* A little background with JavaScript

## Setup
Set your dojo config to load the module.

```javascript
var package_path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
var dojoConfig = {
    // The locationPath logic below may look confusing but all its doing is
    // enabling us to load the api from a CDN and load local modules from the correct location.
    packages: [{
        name: "application",
        location: package_path + '/js'
    }]
};
```

## Require module
Include the module for the ButtonController widget.

```javascript
require(["application/ButtonController", ... ], function(ButtonController, ... ){ ... });
```

## Constructor
ButtonController(options, srcNode);

### Options (Object)
|property|required|type|value|description|
|---|---|---|---|---|
|theme|x|string||CSS Class for styling the button.|
|themeSelected|x|string||CSS Class for styling the button when it's active.|
|top||integer|0|Position of the ButtonController widget.|
|left||integer|0|Position of the ButtonController widget.|
|buttons|x|array||Array of buttons to be created.  See buttons options list.|

#### buttons Options (Object)
|property|required|type|value|description|
|---|---|---|---|---|
|title||string||Button's title CSS.|
|image|x|string||Path to the button's image.|
|window|x|object||Window that will be controlled by the button.  See window options list.|

#### window Options (Object)
|property|required|type|value|description|
|---|---|---|---|---|
|id|x|string||Id for the Div that will be placed in the FloatingPane, for inserting content.|
|title|x|string||Title to be given to the FloatingPane window widget.|
|top||integer|0|Position of the FloatingPane window widget.|
|left||integer|0|Position of the FloatingPane window widget.|
|height||integer|0|Size of the FloatingPane window widget.  If not provided, this window will attempt to resize itself to it's content.|
|width||integer|0|Size of the FloatingPane window widget.  If not provided, this window will attempt to resize itself to it's content.|
|margin||integer|5|Margin inside the FloatingPane window widget.|
|resizable||boolean|false|Toggles if the FloatingPane can be resized.|

## Methods
### startup
startup(): Start the ButtonController, only after any widgets contained within it's windows that have dojo layout items (eg: tab containers) are created.

## Constructor
ButtonController(options, srcNode);

## Events
The ButtonController will emit events when the controlled FloatingPanes are hidden and shown.  Events will emit in the format "`show<window.id>`" and "`hide<window.id>`".

```javascript
// Example event: When the MeasurementWindow is shown
on(buttonController, "showMeasurementWindow", function()
{
    measurement.setTool("distance", true);
});

// Example event: When the MeasurementWindow is hidden
on(buttonController, "hideMeasurementWindow", function()
{
    measurement.setTool("area", false);
    measurement.setTool("distance", false);
    measurement.setTool("location", false);
    measurement.clearResult();
});
```

## Issues
Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing
Anyone and everyone is welcome to contribute.

## Licensing
The MIT License (MIT)

Copyright (c) 2016 Joseph Rogan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


