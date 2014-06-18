
// Screen Detection

$(window).on('ready resize orientationchange', function() {
    // Set page sizes
    resizePage();
});

$(document).on('pagecontainershow', function( event, data ) {
    // Set page sizes
    resizePage();
});

// Resize page
function resizePage() {
    setPageHeight();
	setHeaderLeftMargin();
    setHeaderWidth();
//	$('.feed-list').listview('refresh');
//	$('.main-content').trigger('refresh');
//	$('.main-body').trigger('refresh');
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
	var w = $(window).width();
//	alert('Width: ' + w);
	if (w > 480) {
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

	if (w < 479) {
		$("[data-role='header']").width(w);
	}
}


