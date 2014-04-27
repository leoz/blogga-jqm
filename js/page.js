
// Show Page

function showInitialPage() {
	window.pageController.reset();
    var page = buildPage();
    createInitialPage(page);
}

function showLastPage() {
    removeFirstPage();

    var page = buildPage();

    if (activePage().is(':visible')) {
        createLastPage(page);
    }
    else {
        createInitialPage(page);
    }
}

function showFirstPage() {
    removeLastPage();

    var page = buildPage();

    if (activePage().is(':visible')) {
        createFirstPage(page);
    }
    else {
        createInitialPage(page);
    }
}

// Create Pages

function createInitialPage(data) {
    var p = $(data);
    p.appendTo($.mobile.pageContainer);
    $.mobile.pageContainer.pagecontainer('change', p, {
        transition: 'none'
    });
}

function createFirstPage(data) {
    if (!canDoPrev()) {
        activePage().before(data);
    } else {
        getFirst().before(data);
    }
    $.mobile.pageContainer.pagecontainer('change', getFirst().last(), {
	    transition: 'slide'
    });
}

function createLastPage(data) {
    if (!canDoNext()) {
        activePage().after(data);
    } else {
        getLast().after(data);
    }
    $.mobile.pageContainer.pagecontainer('change', getLast().last(), {
        transition: 'slide',
        reverse: true
    });
}

// Remove Pages

function removeFirstPage() {
    if (window.pageController.max <= $('[data-role=page]').length) {
        var page = getFirst();
        if(page.length === 0) {
            page = activePage();
            var active_page = page.next('[data-role=page]');
	        $.mobile.pageContainer.pagecontainer('change', active_page, {
		        transition: 'none'
	        });

        }
        page.remove();
    }
}

function removeLastPage() {
    if (window.pageController.max <= $('[data-role=page]').length) {
        var page = getLast();
        if(page.length === 0) {
            page = activePage();
            var active_page = page.prev('[data-role=page]');
	        $.mobile.pageContainer.pagecontainer('change', active_page, {
		        transition: 'none'
	        });

        }
        page.remove();
    }
}

// Page Controller

window.pageController = {
    first : 0,
	current : 0,
	max : 5,
    reset: function () {
        this.first = 0;
        this.current = 0;
		this.max = 5;
    },
    isLastPage: function () {
        console.log('isLastPage: ' + (window.pageController.current <= 0));
        return (window.pageController.current <= 0);
    },
    isFirstPage: function () {
        console.log('isFirstPage: ' + (window.lj_conf.number != window.lj_conf.count));
        return (window.lj_conf.number != window.lj_conf.count);
    }
};

// Create page

function createPageId() {
	return '"page_' + window.pageController.current + '"';
}

function createPageTitle() {
	return '"Page ' + window.pageController.current + ' - ' + getJournalPageTitle() + '"';
}

function getJournalPageTitle() {
    var d = new Date(window.lj_conf.date);
    var title =  window.lj_conf.journal + ' ' + $.format.date(d, 'dd-MMM-yyyy hh:mm p');
    return title;
}

function createPageNumber() {
	return '"' + window.pageController.current + '"';
}

function buildPage() {
	var s = '';
	s += '<div data-role="page" id=' + createPageId();
	s += ' data-title=' + createPageTitle();
    s += ' data-page-number=' + createPageNumber();
    s += '>';
	s += '<div role="main" class="ui-content main-content">';
	s += '<ul data-role="listview" class="livejournal"></ul>';
	s += '</div>';
	s += '</div>';
	return s;
}
