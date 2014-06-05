
// Panel logic

function initPanel() {
    // Init panel UX
	$('body > [data-role="panel"] [data-role="controlgroup"]').enhanceWithin();
	$('body > [data-role="panel"] [data-role="listview"]').listview();
	// Init panel widgets
	setJournals();
    $('#journal-input').val(window.lj_data.current);
	$('#btn_change').click(function() { onChange(); });
}

function setJournals() {
	window.lj_data.init();
    var def_pic = 'img/avatar.png';
	$.each(window.lj_data.data, function( i, item ) {
		addJournal(item, def_pic);
	});
}

function onChange() {
    var name = $('#journal-input').val();

	loadJournal(name);
}

function loadJournal(name) {
    // Test journal loading
    setTimeout(function() {
        $.livejournal.getuserpics(name, parseJournal, loadJournalFailed);
    }, 0);    
}

function parseJournal(data, name) {
	console.log('parseJournal - ' + name);
	
	var pic = parseUserPics(data, name);
	updateJournals(name, pic);
}

function parseUserPics(data, name) {
	console.log('parseUserPics - ' + name);
	console.log(data.defaultpicurl);
	return formatUserPic(data);
}

function formatUserPic(data) {
    var def_pic = 'img/avatar.png';
    if (data.hasOwnProperty('defaultpicurl')) {
        return (data.defaultpicurl != '' ? data.defaultpicurl : def_pic);
    }
    return def_pic;
}

function updateJournals(name, pic) {
	console.log('updateJournals - ' + name);
	// Update the journal list
	var found = selectJournal(name);
	if (!found) {
		addJournal(name, pic);
	}
	else {
	    $('ul.journal-list #img_' + name).attr('src', pic);
	}

	setJournal(name);
}

function loadJournalFailed(name) {
	console.log('loadJournalFailed - ' + name);
}

function setJournal(name) {
	// Reset config
	window.lj_conf.reset();
	// Set journal
    window.lj_data.setCurrent(name);
    console.log('setJournal: ' + window.lj_data.current);
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
		img_pic  : pic,
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
		window.lj_data.remJournal($(text_id).text());
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

