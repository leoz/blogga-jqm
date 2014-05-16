
// Cordova App initialization JS file

function onInitialize() {
    var t = 'Application initialized';
    $('#message').append('<br/>' + t);
    console.log(t);            
}        

app.initialize(onInitialize);


