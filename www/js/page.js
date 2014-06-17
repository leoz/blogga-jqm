
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

function createPageTitle() {
	var s = '';
    s += getJournalPageTitle();
    s += ' (';
    s += (window.pageController.current + 1);
    s += ')';
	return s;
}

function getJournalPageTitle() {
    var date = window.lj_conf.getPageDate(window.pageController.current);
    if (!date) {
        date = new Date();
    }
    var title =  window.db_journals.current + ' ' + $.format.date(date, 'dd/MM/yy');
    return title;
}

function buildPage() {

    var page_data = {
        page_id: 'page_' + window.pageController.current,
        page_title: createPageTitle(),
        page_number: window.pageController.current,
        expanded: window.lj_conf.expanded
    };

    var t = $.Mustache.render('feed-page-template', page_data);

	return t;
}

//


