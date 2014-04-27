
// Navigation

function setActions() {
	$('#btn_last').click(function() { onLast(); });
	$('#btn_next').click(function() { onNext(); });
	$('#btn_prev').click(function() { onPrev(); });
	$('#btn_first').click(function() { onFirst(); });
	$('#btn_close').click(function() { onClose(); });
}

function setButtons() {
    if (canDoNext()) {
		$('#btn_last').prop('disabled', true).removeClass('ui-disabled');
    }
	else {
		$('#btn_last').prop('disabled', true).addClass('ui-disabled');
	}
    if (canDoPrev()) {
		$('#btn_first').prop('disabled', true).removeClass('ui-disabled');
    }
	else {
		$('#btn_first').prop('disabled', true).addClass('ui-disabled');
	}
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
    if (e.type == 'swipeleft') {
        onPrev();
    }
    if (e.type == 'swiperight') {
        onNext();
    }
});

function onFirst() {
    if (canDoPrev()) {
        var page = getFirst();
	    $.mobile.pageContainer.pagecontainer('change', page, {
		    transition: 'slide'
	    });
        window.pageController.current = page.data('page-number');
	}
    console.log('Cur: ' + window.pageController.current);
}

function onLast() {
    if (canDoNext()) {
        var page = getLast();
        $.mobile.pageContainer.pagecontainer('change', page, {
		    transition: 'slide',
		    reverse: true
	    });
        window.pageController.current = page.data('page-number');
	}
    console.log('Cur: ' + window.pageController.current);
}


function onClose() {
    window.lj_conf.reset();
    $('[data-role="page"]').remove();
    $('[data-role="header"] h1').text( ' - ' );
    showInitialPage();
	setButtons();
}

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

