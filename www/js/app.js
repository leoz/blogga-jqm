
// Application

$(function() {
    // BEGIN
    console.log('Ready - BEGIN');

	// Init databases
	window.db_blobs.init();
	window.db_journals.init();
	window.db_userpics.init();

    // Set toolbars and panels
    $('[data-role="navbar"]').navbar();
    $('[data-role="header"], [data-role="footer"]').toolbar();
    $('[data-role="panel"]').panel();

    // Init colors
    $.fn.autumn.init({
        colorProfile:['hsl', 40, 80, 85, 95],
        hueScale:1,
        hueCenter:0,
        generator:'halton',
        primeWalkHueDistance: 223
    });

    // Load templates
    $.Mustache.load('templates.html').done(function () {
        console.log('Mustache.load is done');
		// Init panel
		initPanel();
        // Create first page
        onFeed();
	    onHome();
		// Set page sizes
		resizePage();
    });

    // END
    console.log('Ready - END');
});

$(document).on('pagecontainercreate', function() {
	// Reset config
	window.lj_conf.reset();
});

$(document).on('pagecontainerbeforeshow', function(e, ui) {
    var page_id = activePage().attr('id');
    if (page_id != 'post_page' && page_id != 'main_page') {
	    // Set title
        var title = activePage().data('title');
        $('[data-role="header"] h1').text( title );
    }
    
    // Fix iscroll event handling for lazy image loading
    $('.iscroll-wrapper', this).bind( {
        iscroll_onscrollend : function() {
//            console.log('.iscroll-wrapper -> iscroll_onscrollend');
            $('.main-body').iscrollview('refresh');
            $('.main-body').trigger('scroll');
        }
    });     
});

$(document).on('pagechange', function(e) {
	// Enable/disable buttons
	setButtons();
});

$(document).on('pagecreate', '[data-role=page]', function(e) {
    var page_id = $(this).attr('id');
    console.log('pagecreate: ' + page_id);
    if (page_id != 'post_page' && page_id != 'main_page') {
        var id = '#' + page_id + ' .main-content .feed-list';
        loadFeed(id);
    }
});

// Exit handling

$(window).on('unload beforeunload', function() {
    console.log('Window unload');
	// Close databases
	window.db_blobs.close();
	window.db_journals.close();
	window.db_userpics.close();
});

