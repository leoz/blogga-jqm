
// Feed parsing

function addRecord(record, user, id) {

    var r_date = formatDate(record.eventtime);

    var r_author = formatAuthor(record, user);

    var r_avatar = formatAvatar(record);

    var r_button_id = 'btn_' + record.itemid;

    var r_title_id = 'title_' + record.itemid;
    var r_title = formatTitle(record, r_title_id, id);

    var r_content_id = 'content_' + record.itemid;
    var r_content = formatContent(record, r_content_id, id);

    var s = '';

    s += '<li class="content-item" data-role="collapsible" data-collapsed="' + (!window.lj_conf.expanded) + '" data-inset="false"';
    s += ' data-iconpos="right" data-collapsed-icon="carat-r" data-expanded-icon="carat-d">';
    s += '<h2>';
    s += '<table class="title-table">';
    s += '<tr>';
    s += '<td class="avatar-box"><img class="avatar-icon" src="' + r_avatar + '"/></td>';
    s += '<td class="title-box" valign="top">';
    s += '<div class="title-date">' + r_date + '</div>';
    s += '<div class="title-name" id="' + r_title_id + '">' + r_title + '</div>';
    s += '<div class="title-user">' + r_author + '</div>';
    s += '</td>';
    s += '<td class="comments-box">';  
    
    s += '<a href="#" data-role="button" data-shadow="false" class="btn-comments"';
    s += ' id="' + r_button_id + '">' + record.reply_count + '</a>';
    
    s += '</td>';
    s += '<td class="space-box"></td>';
    s += '</tr>';
    s += '</table>';
    s += '</h2>';
    s += '<div id="' + r_content_id + '" class="content-box">' + r_content + '</div>';
    s += '</li>';

    $(id).append(s).enhanceWithin();
    
	$('#' + r_button_id).click(function(e) {
        onComments(r_button_id);
        e.preventDefault();
        e.stopPropagation();   
        e.stopImmediatePropagation();
	});
    
    $(id).listview('refresh');
}

function onComments(id) {
    alert('onComments: ' + id);
}
    
function doneReading(count, date) {
    window.lj_conf.count = count;
    window.lj_conf.date = date;
}

function formatDate(s) {
    var d = new Date(s);
    return $.format.date(d, "dd MMM yyyy, hh:mm p");
}

function formatAuthor(record, user) {
    if (record.hasOwnProperty('poster')) {
        return record.poster;
    }
    return user;
}

function formatAvatar(record) {
    if (record.hasOwnProperty('poster_userpic_url')) {
        return record.poster_userpic_url;
    }
    return 'img/avatar.png';
}

function formatTitle(record, id, parent_id) {
    if (record.hasOwnProperty('subject')) {
        array_buffer_to_string(record.subject, 
            function (string) {
			    $(parent_id + ' #' + id).append(string);
            }
        );
        return '';
    }
    return '.';
}

function formatContent(record, id, parent_id) {
    if (record.hasOwnProperty('event')) {
        array_buffer_to_string(record.event, 
            function (string) {
			    $(parent_id + ' #' + id).append(string);
            }
        );
        return '';
    }
    return '.';
}

function array_buffer_to_string(buf, callback) {

    var bb = new Blob([buf]);
    var f = new FileReader();
    f.onload = function(e) {
        callback(e.target.result)
    }
    f.readAsText(bb);
}


