
// Journals view

function initJournalsView() {
	setJournals();
    $('#journal-input').val(window.db_journals.current);
	$('#btn_change').click(function() { onChange(); });
}

function setJournals() {
	$.each(window.db_journals.data, function( i, item ) {
		var pic = window.db_userpics.getUserPic(item);
		addJournal(item, pic);
	});
}

function onChange() {
    var name = $('#journal-input').val();

	console.log('onChange - ' + name);

	if (selectJournal(name)) {
		setJournal(name);
	}
	else {
		setTimeout(function() {
		    $.livejournal.getuserpics(name,
			                          testJournalSucceed,
			                          testJournalFailed);
		}, 0);    
	}
}

function testJournalSucceed(data, name) {
	// Do not use the data

	console.log('testJournalSucceed - ' + name);
	
	var pic = window.db_userpics.getUserPic(name);
	addJournal(name, pic);
	selectJournal(name);	
	setJournal(name);
}

function testJournalFailed(name) {
	console.log('testJournalFailed - ' + name);
}

function setJournal(name) {
	// Reset config
	window.lj_conf.reset();
	// Set journal
    window.db_journals.setCurrent(name);
    console.log('setJournal: ' + window.db_journals.current);
    onHome();
}

function addJournal(name, pic) {

	var r_li_id     = 'li_' + name;
	var r_img_id    = 'img_' + name;
	var r_btn_go_id = 'btn_go_' + name;
	var r_btn_rm_id = 'btn_rm_' + name;
	
	var text_id = '#' + r_li_id + ' .journal-name';

    var journal_data = {
		li_id    : r_li_id,
		img_id   : r_img_id,
		pic_cls  : window.db_userpics.prefix + name,
		avatar   : pic,
		name     : name,
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
		var name = $(text_id).text();
    	$('#journal-input').val(name);
		setJournal(name);
	});

	$('#' + journal_data.btn_rm_id).click(function(e) {
	    e.preventDefault();
		// Remove journal
		window.db_journals.remJournal($(text_id).text());
	    $(this).parent().remove();
	});
}

function selectJournal(name) {
	var result = false;
    $('[data-role="panel"] [data-role="listview"] a.ui-btn-active').removeClass('ui-btn-active');
    // Add active class to current list button
    $('[data-role="panel"] [data-role="listview"] a').each(function() {
        if ( $('.journal-name', this).text() === name ) {
            $(this).addClass('ui-btn-active');
			result = true;
        }
    });
	return result;
}

