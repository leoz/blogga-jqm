
// Feed parsing

function loadFeed(id) {

    setTimeout(function() {
        // Convert the local date to UTC
	    var s = $.format.date(window.lj_conf.date, 'yyyy-MM-ddTHH:mm:ss');
        var date_local = new Date(s);
        var date_utc = date_local.toISOString();
        var s_utc = $.format.date(date_utc, window.lj_conf.format);
        console.log('Date UTC: ' + s_utc);
        $.livejournal.getevents(s_utc, window.db_journals.current, window.lj_conf.number, id, addRecords);
    }, 0);    
}

function addRecords(events, user, id) {

    setTimeout(function() {
        var i = 0;
        addRecord(i, events, user, id);
    }, 0);

    var count = events.length;
    var date = ((count > 0) ? events[count-1].eventtime : '');
    doneReading(count, date);
}

function addRecord(i, records, user, id) {

    if (i < records.length) {
//        console.log('addRecord: ' + i + ' ' + records.length);

        var r_citem_id = 'citem_' + records[i].itemid;
        var r_title_id = 'title_' + records[i].itemid;
        var r_content_id = 'content_' + records[i].itemid;

		var r_pic = formatUserPic(records[i], user);

        var feed_data = {
			citem_id  : r_citem_id,
            collapsed : (!window.lj_conf.expanded),
			pic_cls   : r_pic.pic_class,
            avatar    : r_pic.pic_image,
            date_day  : formatDateDay(records[i].eventtime),
            date_time : formatDateTime(records[i].eventtime),
            title_id  : r_title_id,
            title     : formatTitle(records[i], r_title_id, id),
            author    : formatAuthor(records[i], user),
            button_id : 'btn_' + records[i].itemid,
            count     : records[i].reply_count,
            count_text: formatCountText(records[i].reply_count),
            content_id: r_content_id,
            content   : formatContent(records[i], r_content_id, id),
            page_title: $('#header_main h1').text(),
            itemid    : records[i].itemid,
            anum      : records[i].anum
        };

        var t = $.Mustache.render('feed-template', feed_data);

        $(id).append(t).enhanceWithin();
        
	    $('#' + feed_data.button_id).click(function(e) {
            onComments(feed_data);
            e.preventDefault();
            e.stopPropagation();   
            e.stopImmediatePropagation();
	    });

		$('#' + feed_data.citem_id).on('collapsibleexpand', function(event, ui) {
			prepImages('#' + feed_data.content_id);
		});

        $(id).listview('refresh');
        
        setTimeout(function() {
            i++;
            addRecord(i, records, user, id);
        }, 0);       
    }
}

function formatUserPic(record, user) {
	var pic = {
		pic_class : '',
		pic_image : ''
	};

	if (record.hasOwnProperty('poster_userpic_url')) {
		pic.pic_class = '';
		pic.pic_image = record.poster_userpic_url;
	}
	else {
		pic.pic_class = window.db_userpics.prefix + user;
		if (record.hasOwnProperty('poster')) {
			pic.pic_image = window.db_userpics.getUserPic(record.poster);
		}
		else {
			pic.pic_image = window.db_userpics.getUserPic(user);
		}
	}

	return pic;
}

function onFeed(data) {
    var ht = $.Mustache.render('feed-header-template', data);

    $('#header_main').html(ht);
    $('#header_main').toolbar('refresh');

	$('#btn_expand').click(function() { onExpand(); });
	
    var ft = $.Mustache.render('feed-footer-template', data);

    $('#footer_main').html(ft);
    $('#footer_main').toolbar('refresh');
	
	$('#btn_home').click(function() { onHome(); });
	$('#btn_next').click(function() { onNext(); });
	$('#btn_prev').click(function() { onPrev(); });

	if(data != undefined) {
        removeCommentsPage();
	}
}

function removeCommentsPage() {
    var page = activePage();
//    console.log('removeCommentsPage - old page: ' + page.attr('id'));
    var active_page = page.next('[data-role=page]');
//    console.log('removeCommentsPage - new page: ' + active_page.attr('id'));
    $.mobile.pageContainer.pagecontainer('change', active_page, {
        transition: 'slide',
        reverse: true
    });
    page.remove();
}

function doneReading(count, date) {
    window.lj_conf.count = count;
    window.lj_conf.date = date;
}

function formatDateDay(s) {
    return $.format.date(s, 'dd MMM yyyy');
}

function formatDateTime(s) {
    return $.format.date(s, 'hh:mm p');
}

function formatAuthor(record, user) {
    if (record.hasOwnProperty('poster')) {
        return record.poster;
    }
    return user;
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

function formatCountText(count) {
    if (count <= 0) {
        return 'No Comments';
    }
    return count + ' Comments';
}

function formatContent(record, id, parent_id) {
    if (record.hasOwnProperty('event')) {
        array_buffer_to_string(record.event, 
            function (string) {
				var cid = parent_id + ' #' + id;
			    $(cid).append(string);
				hideImages(cid);
            }
        );
        return '';
    }
    return '.';
}

function hideImages(cid) {
	$(cid + ' img').each(function() {
		$(this).attr('data-src', $(this).attr('src'));
		$(this).attr('src', 'img/blank.gif');
		$(this).addClass('lazy');
	});
}

function prepImages(cid) {
//	var i = 0;
    var page = activePage();
	var id = page.attr('id');
	$(cid + ' img.lazy').each(function() {
//		console.log('img.lazy: ' + i++);

		$(this).css('opacity', '0');

		$(this).on('appear', function() {
			$(this).removeClass('lazy');
			$(this).attr('src', $(this).attr('data-src'));
			$(this).hide();
			$(this).css('opacity', '1');
			$(this).fadeIn(1000);
		});

		$(this).initAppear({once: true, container: $('#' + id + ' .main-body')});
	});
}

function array_buffer_to_string(buf, callback) {

    var bb = new Blob([buf]);
    var f = new FileReader();
    f.onload = function(e) {
        callback(e.target.result)
    }
    f.readAsText(bb);
}

