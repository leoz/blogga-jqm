
// Cordova App main JS file

var jqmReady = $.Deferred();
var pgReady = $.Deferred();

var app = {
    //Callback for when the app is ready
    callback: null,
    // Application Constructor
    initialize: function(callback) {
        this.callback = callback;
        var browser = document.URL.match(/^https?:/);
        if(browser) {
            console.log('Is web');
            //In case of web we ignore PG but resolve the Deferred Object to trigger initialization
            pgReady.resolve();
        }
        else {
            console.log('Is not web');
            this.bindEvents();
        }
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(event) {
        switch(event) {
        case 'deviceready':
            pgReady.resolve();
            break;
        }
    }
};

$(function() {
    jqmReady.resolve();
});

// General initialization
$.when(jqmReady, pgReady).then(function() {
    //Initialization code here
    if(app.callback) {
        app.callback();
    }
    console.log('Frameworks ready');
});

