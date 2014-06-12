
// Panel logic

function initPanel() {
    // Init panel UX
	$('body > [data-role="panel"] [data-role="controlgroup"]').enhanceWithin();
	$('body > [data-role="panel"] [data-role="listview"]').listview();
	// Init panel widgets
	initJournalsView();
}

