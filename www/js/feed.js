
// Feed parsing

function loadFeed(id) {

    setTimeout(function() {
        $.livejournal.getevents(window.lj_conf.date, window.db_journals.current, window.lj_conf.number, id, addRecords);
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

        var r_citem_id   = 'citem_' + records[i].itemid;
        var r_pic_id     = 'pic_' + records[i].itemid;
        var r_title_id   = 'title_' + records[i].itemid;
        var r_content_id = 'content_' + records[i].itemid;

		var r_pic = formatUserPic(records[i], r_pic_id, id, user);

		var r_author = formatAuthor(records[i], user);

        var feed_data = {
			citem_id  : r_citem_id,
            collapsed : (!window.lj_conf.expanded),
            pic_id    : r_pic_id,
			pic_cls   : r_pic.pic_class,
            avatar    : r_pic.pic_image,
            date_day  : formatDateDay(records[i].eventtime),
            date_time : formatDateTime(records[i].eventtime),
            title_id  : r_title_id,
            title     : formatTitle(records[i], r_title_id, id),
            author    : r_author,
			user_id   : 'btn_user_' + records[i].itemid,
            button_id : 'btn_' + records[i].itemid,
            count     : records[i].reply_count,
            count_text: formatCountText(records[i].reply_count),
            content_id: r_content_id,
            content   : formatContent(records[i], r_content_id, id),
            page_title: getHeaderText(),
            itemid    : records[i].itemid,
            anum      : records[i].anum
        };

        var t = $.Mustache.render('feed-template', feed_data);

        $(id).append(t).enhanceWithin();
        
	    $('#' + feed_data.user_id).click(function(e) {
            onUser(r_author);
            e.preventDefault();
            e.stopPropagation();   
            e.stopImmediatePropagation();
	    });
        
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

function onUser(user) {
	console.log('onUser: ' + user);
	changeJournal(user, false);
}

function formatUserPic(record, id, parent_id, user) {
	var pic = {
		pic_class : '',
		pic_image : ''
	};

	if (record.hasOwnProperty('poster_userpic_url')) {
		pic.pic_class = '';
		pic.pic_image = record.poster_userpic_url;
	}
	else {
		var name = user;

		if (record.hasOwnProperty('poster')) {
			name = record.poster;
		}

		if (record.hasOwnProperty('props') && 
            record.props.hasOwnProperty('picture_keyword')) {

			formatAltImage(record, id, parent_id, name);

			//pic.pic_class = window.db_userpics.prefix + name + '-' + record.props.picture_keyword;
			//pic.pic_image = window.db_userpics.getCustomUserPic(name, record.props.picture_keyword);
		}
		else {
			pic.pic_class = window.db_userpics.prefix + name;
			pic.pic_image = window.db_userpics.getUserPic(name);
		}
	}

	return pic;
}

function onFeed(data) {
    var ht = $.Mustache.render('feed-header-template', data);

    $('#header_main').html(ht);
    $('#header_main').toolbar('refresh');

	$('#btn_expand').click(function() {

		$(this).toggleClass('ui-icon-plus');
		$(this).toggleClass('ui-icon-minus');

		onExpand();
	});
	
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

function formatAltImage(record, id, parent_id, name) {
	if (record.hasOwnProperty('props') && 
        record.props.hasOwnProperty('picture_keyword')) {

        array_buffer_to_string(record.props.picture_keyword, 
            function (string) {
				var p_class = window.db_userpics.prefix + name + '-' + string;
				var p_image = window.db_userpics.getCustomUserPic(name, string);
				var p_id = parent_id + ' #' + id;

				console.log('formatAltImage image is ' + p_id);

				$(p_id).attr('alt', p_class);
				$(p_id).attr('src', p_image);
            }
        );
	}
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

