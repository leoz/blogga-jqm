
// Application

$(function() {
    // BEGIN
    console.log('Ready - BEGIN');

    // Set toolbars and panels
    $('[data-role="navbar"]').navbar();
    $('[data-role="header"], [data-role="footer"]').toolbar();
    $('[data-role="panel"]').panel();
    
    // Set settings
    $('#journal-input').val(window.lj_conf.journal);
    $('[data-role="controlgroup"]').enhanceWithin();

	// Set button actions
	setActions();

    // Load templates
    $.Mustache.load('templates.html').done(function () {
        console.log('Mustache.load is done');
        // Create first page
        onFeed();
	    onClose();
    });

    // END
    console.log('Ready - END');
});

$(document).on('pagecontainercreate', function() {
	// Set Journal
    window.lj_conf.setJournal('toronto-ru');
});

$(document).on('pagecontainerbeforeshow', function(e, ui) {
	// Set title
    var title = activePage().data('title');
    $('[data-role="header"] h1').text( title );
});

$(document).on('pagechange', function(e) {
	// Enable/disable buttons
	setButtons();
});

$(document).on('pagecreate', '[data-role=page]', function(e) {
    var id = '#' + $(this).attr('id') + ' .main-content .livejournal';
    $.livejournal.getevents(window.lj_conf.date, window.lj_conf.journal, window.lj_conf.number, addRecord, id, doneReading);
});

