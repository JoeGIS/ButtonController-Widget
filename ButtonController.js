/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////----ButtonController.js----/////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
// 
// Version: 1.1
// Author: Joseph Rogan (joseph.rogan@forces.gc.ca canadajebus@gmail.com)
// 
// 
// This reusable widget allows the user to automatically configure a row of buttons that open/clsoe floating windows.
// Opening these windows emit's events from the buttonController in the format "show<window.id>" and "hide<window.id>"
//
// ButtonController widget example
// var buttonController = new ButtonController({
    // theme: "customButton", 
    // themeSelected: "customButtonSelected", 
    // top: 20,
    // left: 80,
    // buttons: [{
        // title: "Location", 
        // image: "images/LocationButton.png", 
        // window: {
            // id: "LocationWindow", 
            // title: "Location", 
            // top: 50, left: 0}
        // }, 
        // {
        // title: "Bookmarks", 
        // image: "images/BookmarksButton.png", 
        // window: {
            // id: "BookmarksWindow", 
            // title: "Bookmarks", 
            // top: 50, left: 0}
        // }, 
        // {
        // title: "Measurement", 
        // image: "images/MeasurementButton.png", 
        // window: {
            // id: "MeasurementWindow", 
            // title: "Measurement", 
            // top: 50, left: 0, height: 125, width: 250}
        // }, 
        // {
        // title: "Draw", 
        // image: "images/DrawButton.png", 
        // window: {
            // id: "DrawWindow", 
            // title: "Draw", 
            // top: 50, left: 0}
        // }]
    // }, "ButtonControllerDiv");
// 
// 
// 
// Startup the Button Controller, only after any widgets contained within it's windows that have dojo layout items (eg: tab containers) are created.
// buttonController.startup();
// 
// 
// 
// Example event: When the MeasurementWindow is shown
// on(buttonController, "showMeasurementWindow", function()
// {
    // measurement.setTool("distance", true);
// });
// 
// Example event: When the MeasurementWindow is hidden
// on(buttonController, "hideMeasurementWindow", function()
// {
    // measurement.setTool("area", false);
    // measurement.setTool("distance", false);
    // measurement.setTool("location", false);
    // measurement.clearResult();
// });
// 
// Changes:
// Version 1.1
//  - Added resizeFloatingPane(id) method which attempts to size the widget to fit it's content.  
//    Widgets within should have white-space: nowrap; css set.
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

define(["dijit/_WidgetBase", "dojo/Evented", 

    "dojox/layout/FloatingPane",
    
    "dojo/_base/declare", 
    "dojo/_base/lang", 
    "dojo/on", 
    "dojo/dom", 
    "dojo/dom-geometry", 
    
    "dojo/domReady!"

], function(_WidgetBase, Evented, 
    FloatingPane, 
    declare, lang, on, dom, domGeom)
{
    
    return declare([_WidgetBase, Evented], {
        
        buttonsDivs: [], 
        windows: [], 
        floatingPanes: [], 
        
        defaultMargin: 5,
        
        // The defaults
        defaults: {
            theme: "", 
            themeSelected: "", 
            top: 0, 
            left: 0, 
            buttons: [{
                title: "", 
                image: "", 
                window: {
                    id: "", 
                    title: "", 
                    top: 0, 
                    left: 0, 
                    height: 0, 
                    width: 0,
                    margin: 5, 
                    resizable: false
                }
            }]
        },
        
        
        // Called when the widget is declared as new object
        constructor: function(options, srcRefNode) {
            // Mix in the given options with the defaults
            var properties = lang.mixin({}, this.defaults, options);
            this.set(properties);
        },
        
        
        // Called after the widget is created
        postCreate: function() {
        
            // Set the position of the button controller
            this.domNode.style.top = this.top + "px";
            this.domNode.style.left = this.left + "px";
            
            // Loop through each button to be created
            for (var i in this.buttons)
            {
                // Get the prefs for the button and window
                var buttonPrefs = this.buttons[i];
                var windowPrefs = buttonPrefs.window;
                
                // Create the button
                this.buttonsDivs[i] = dojo.create("div", { id: "ControlledButton" + i }, this.domNode);
                dojo.addClass(this.buttonsDivs[i], this.theme);
                dojo.style(this.buttonsDivs[i], "background-image", "url('" + buttonPrefs.image + "')");
                this.buttonsDivs[i].title = buttonPrefs.title;
                
                // Create the window holder div
                this.windows[i] = dojo.create("div", {id: "ControlledWindow" + i }, this.domNode);
                
                // Set the default margin if it wasn't defined
                if (!this.buttons[i].window.margin) this.buttons[i].window.margin = this.defaultMargin;
                
                // Create the floating plane
                this.floatingPanes[i] = new FloatingPane({
                    title: windowPrefs.title,
                    resizable: windowPrefs.resizable, 
                    dockable: false, 
                    closable: true, 
                    content: "<div style='margin: " + windowPrefs.margin + "px;' class='ControllerWindowHolder'><div id='" + windowPrefs.id + "' class='ControllerWindow'></div></div>",
                    style: "position: absolute; display: block;",
                    id: "ControlledFP" + i
                    }, this.windows[i]);
                
                this.floatingPanes[i].startup();
                
                
                // Calculate the starting height
                var height;
                if (this.buttons[i].window.height) height = windowPrefs.height;
                else height = 50;
                
                // Calculate the starting width
                var width;
                if (this.buttons[i].window.width) width = windowPrefs.width;
                else width = 250;
                
                // Resize it
                this.floatingPanes[i].resize({ x:windowPrefs.left, y:windowPrefs.top, w:width, h:height });
            }
            
            
            // Loop through each event to be created
            for (var i in this.buttons)
            {
                // Var for moving .this to the event function scope
                var _this = this;
                
                // Wire event for when the button clicked
                on(this.buttonsDivs[i], "click", function($_this)
                {
                    // Var for remembering if we need to reopen the window
                    var reOpen = true;
                    var buttonId = this.id.replace("ControlledButton", "");
                    if (dom.byId("ControlledFP" + buttonId).style.display == "block") reOpen = false;
                    
                    // Hide all other open windows
                    for (var i = 0 ; i < _this.windows.length; ++i)
                    {
                        // If there is an open window
                        if (dom.byId("ControlledFP" + i).style.display == "block")
                        {
                            // Hide it
                            dom.byId("ControlledFP" + i).style.display = "none";
                            dom.byId("ControlledButton" + i).className = "customButton";
                            // Emit a hide event
                            _this.emit("hide" + _this.buttons[i].window.id, {});
                        }
                    }
                    // Open the window that matches the button
                    if (reOpen)
                    {
                        // Emit a show event
                        _this.emit("show" + _this.buttons[buttonId].window.id, {});
                        
                        dom.byId(this.id.replace("ControlledButton", "ControlledFP")).style.display = "block";
                        this.className = "customButtonSelected";
                        
                        // Resize to fit its content
                        _this.resizeFloatingPane( this.id.replace("ControlledButton", "") );
                        
                    }
                });
                
                // Override event for when the floating pane is closed, to just hide it instead
                this.floatingPanes[i].close = function($_this)
                {
                    dom.byId(this.id).style.display = "none";
                    dom.byId(this.id.replace("ControlledFP", "ControlledButton")).className = "customButton";
                    
                    // Emit a hide event
                    _this.emit("hide" + _this.buttons[this.id.replace("ControlledFP", "")].window.id, {});
                };
                
            }
            
        }, 
        
        // Called when the widget.startup() is used to view the widget.  Should be called after all content is created
        startup: function() {
            this.inherited(arguments);
            // Hide all the floating planes
            for (i in this.floatingPanes)
            {
                dom.byId("ControlledFP" + i).style.display = "none";
            }
                // this.emit("test", {});
        },
        
        // Resizes a floating pane of a given id based on its content size
        resizeFloatingPane: function(id) {
            // Floating pane header height
            var fpHeaderHeight = 30;
            
            // Calculate the height
            var height;
            if (this.buttons[id].window.height) height = this.buttons[id].window.height;
            else height = dom.byId(this.buttons[id].window.id).scrollHeight + (this.buttons[id].window.margin * 2) + fpHeaderHeight;
            
            
            // Calculate the width
            var width;
            if (this.buttons[id].window.width) width = this.buttons[id].window.width;
            else width = dom.byId(this.buttons[id].window.id).scrollWidth + (this.buttons[id].window.margin * 2);
            
            // Position
            var top = this.floatingPanes[id].domNode.style.top;
            var left = this.floatingPanes[id].domNode.style.left;
            
            // Resize it
            this.floatingPanes[id].resize({ x:left, y:top, w:width, h:height });
            
        }
        
        
        
        
    });

});