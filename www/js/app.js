
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
	// Set Journal
    window.lj_conf.setJournal('toronto-ru');
});

$(document).on('pagecontainerbeforeshow', function(e, ui) {
    var page_id = activePage().attr('id');
    if (page_id != 'post_page' && page_id != 'main_page') {
	    // Set title
        var title = activePage().data('title');
        $('[data-role="header"] h1').text( title );
    }
});

$( document ).on( "pagecontainershow", function( event, data ) {
    // Set page sizes
    resizePage();
});

$(window).on("resize orientationchange", function() {
    // Set page sizes
    resizePage();
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

// Resize page
function resizePage() {
    setPageHeight();
	setHeaderLeftMargin();
    setHeaderWidth();
}

// Set page height
function setPageHeight() {
    scroll(0, 0);
    var content = $.mobile.getScreenHeight() -
                  $(".ui-header").outerHeight() - $(".ui-footer").outerHeight() -
                  $(".ui-content").outerHeight() + $(".ui-content").height();
    $(".ui-content").height(content + 2);
}

// Set header width
function setHeaderLeftMargin() {
	var pl = $(".ui-content").css("padding-left");    
	$("[data-role='header']").css("margin-left", pl);
}

// Set header width
function setHeaderWidth() {
	if( $(window).width() > 800 ) {
		if ($.mobile.activePage) {
		    var id = $.mobile.activePage.attr('id');
		    var cid = "#" + id + " .ui-content";
		    var w = $(cid).width();
		    if (w > 0) {
		        $("[data-role='header']").width(w - 1);
		        $("[data-role='header']").show();
		    }
		    else {
		        $("[data-role='header']").hide();
		    }
		}
		else {
		    $("[data-role='header']").hide();
		}
	}

	if( $(window).width() < 799 ) {
		$("[data-role='header']").width($(window).width());
	}
}

