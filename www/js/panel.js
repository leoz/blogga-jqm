
// Panel logic

function initPanel() {
    // Init panel UX
	$('body > [data-role="panel"] [data-role="controlgroup"]').enhanceWithin();
	$('body > [data-role="panel"] [data-role="listview"]').listview();
	// Init panel widgets
	loadJournals();
    $('#journal-input').val(window.lj_data.current);
	$('#btn_change').click(function() { onChange(); });
}

function loadJournals() {
	window.lj_data.init();
	$.each(window.lj_data.data, function( i, item ) {
		addJournal(item);
	});
}

function onChange() {
    var name = $('#journal-input').val();

	var found = setJournal(name);
	if (!found) {
		addJournal(name);
	}

	loadJournal(name);
}

function loadJournal(name) {
	// Reset config
	window.lj_conf.reset();
	// Set journal
    window.lj_data.setCurrent(name);
    console.log('loadJournal: ' + window.lj_data.current);
    onHome();
}

function addJournal(name) {

	var r_btn_go_id = 'btn_go_' + name;
	var r_btn_rm_id = 'btn_rm_' + name;

    var journal_data = {
		name  : name,
        btn_go_id: r_btn_go_id,
        btn_rm_id: r_btn_rm_id
    };

    var h = $.Mustache.render('journal-template', journal_data);

	$('ul.journal-list').append(h);
	$('ul.journal-list').listview('refresh');

	$('#' + journal_data.btn_go_id).click(function(e) {
	    e.preventDefault();
	    $('[data-role="panel"] [data-role="listview"] a.ui-btn-active').removeClass('ui-btn-active');
		$(this).addClass('ui-btn-active');
		var name = $(this).text();
    	$('#journal-input').val(name);
		loadJournal(name);
	});

	$('#' + journal_data.btn_rm_id).click(function(e) {
	    e.preventDefault();
	    $(this).parent().remove();
		// Remove journal
		window.lj_data.remJournal($(this).attr('title'));
//		console.log('pressed btn remove');
	});
}

function setJournal(name) {
	var result = false;
    $('[data-role="panel"] [data-role="listview"] a.ui-btn-active').removeClass('ui-btn-active');
    // Add active class to current list button
    $('[data-role="panel"] [data-role="listview"] a').each(function() {
        if ( $(this).text() === name ) {
            $(this).addClass('ui-btn-active');
			result = true;
        }
    });
	return result;
}

