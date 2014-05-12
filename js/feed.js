
// Feed parsing

function addRecord(record, user, id) {

    var r_title_id = 'title_' + record.itemid;

    var r_content_id = 'content_' + record.itemid;

    var feed_data = {
        collapsed : (!window.lj_conf.expanded),
        avatar    : formatAvatar(record),
        date      : formatDate(record.eventtime),
        title_id  : r_title_id,
        title     : formatTitle(record, r_title_id, id),
        author    : formatAuthor(record, user),
        button_id : 'btn_' + record.itemid,
        count     : record.reply_count,
        content_id: r_content_id,
        content   : formatContent(record, r_content_id, id),
        page_title: $('#header_main h1').text()
    };

    var t = $.Mustache.render('feed-template', feed_data);

    $(id).append(t).enhanceWithin();
    
	$('#' + feed_data.button_id).click(function(e) {
        onComments(feed_data);
        e.preventDefault();
        e.stopPropagation();   
        e.stopImmediatePropagation();
	});
    
    $(id).listview('refresh');
}

function onComments(data) {

    data.title = $('#' + data.title_id).text();

    var t = $.Mustache.render('post-header-template', data);

    $('#header_main').html(t);
    $('#header_main').toolbar('refresh');

	$('#btn_feed').click(function() { onFeed(data); });
}

function onFeed(data) {
    var t = $.Mustache.render('feed-header-template', data);

    $('#header_main').html(t);
    $('#header_main').toolbar('refresh');

	$('#btn_expand').click(function() { onExpand(); });
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


