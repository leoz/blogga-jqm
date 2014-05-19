
// Navigation

function setActions() {
    // Header
	$('#btn_expand').click(function() { onExpand(); });
    // Panel
	$('#btn_change').click(function() { onChange(); });
    // Navigation
	$('#btn_home').click(function() { onHome(); });
	$('#btn_next').click(function() { onNext(); });
	$('#btn_prev').click(function() { onPrev(); });
}

function setButtons() {
    if (canAddNext()) {
		$('#btn_prev').prop('disabled', true).removeClass('ui-disabled');
    }
	else {
		$('#btn_prev').prop('disabled', true).addClass('ui-disabled');
	}
    if (canAddPrev()) {
		$('#btn_next').prop('disabled', true).removeClass('ui-disabled');
    }
	else {
		$('#btn_next').prop('disabled', true).addClass('ui-disabled');
	}
}

// Page Access

function activePage() {
    return $.mobile.pageContainer.pagecontainer('getActivePage');
}

function getFirst() {
    return activePage().prevAll('[data-role=page]').last();
}

function getLast() {
    return activePage().nextAll('[data-role=page]').last();
}

// Page Navigation

function onPrev() {
    window.pageController.current--;
    if (canDoPrev()) {
		$.mobile.pageContainer.pagecontainer('change', activePage().prev('[data-role=page]'), {
			transition: 'slide'
		});
	}
    else {
        showFirstPage();
    }
    console.log('Cur: ' + window.pageController.current);
}

function onNext() {
    window.pageController.current++;
    if (canDoNext()) {
		$.mobile.pageContainer.pagecontainer('change', activePage().next('[data-role=page]'), {
			transition: 'slide',
			reverse: true
		});
	}
    else {
        showLastPage();
    }
    console.log('Cur: ' + window.pageController.current);
}

$(document).on('swipeleft swiperight', '[data-role=page]', function (e) {
    var page_id = $(this).attr('id');
    if (page_id != 'post_page' && page_id != 'main_page') {
        if (e.type == 'swipeleft') {
		    if (!$('#btn_prev').prop('disabled', true).hasClass('ui-disabled')) {
                onPrev();
		    }
        }
        if (e.type == 'swiperight') {
		    if (!$('#btn_next').prop('disabled', true).hasClass('ui-disabled')) {
                onNext();
		    }
        }
    }
});

function canAddNext() {
    return (!isInTransition() && !window.pageController.isLastPage());
}

function canAddPrev() {
    return (!isInTransition() && !window.pageController.isFirstPage());
}

function canDoNext() {
	return (!isInTransition() && activePage().next('[data-role=page]').length !== 0);
}

function canDoPrev() {
	return (!isInTransition() && activePage().prev('[data-role=page]').length !== 0);
}

function isInTransition() {
	return ($('body.ui-mobile-viewport-transitioning').length !== 0);
}

// Panel

function onHome() {
    console.log('onHome');
    window.lj_conf.reset();
    $('[data-role="page"]').remove();
    $('[data-role="header"] h1').text( ' - ' );
    showInitialPage();
	setButtons();
}

function onChange() {
    var journal = $('#journal-input').val();
    window.lj_conf.setJournal(journal);
    console.log('onChange: ' + window.lj_conf.journal);
    onHome();
}

// Header

function onExpand() {
    var id = activeListId(activePage());
    if ($(id).data('list-expanded') === true) {
        $(id).children().collapsible('collapse');
        $(id).data('list-expanded', false);
    }
    else {
        $(id).children().collapsible('expand');
        $(id).data('list-expanded', true);
    }
}

function activeListId(page) {
    var id = '#' + page.attr('id') + ' .main-content .livejournal';
    return id;
}

//

