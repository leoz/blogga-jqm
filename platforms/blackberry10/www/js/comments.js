
// Comments parsing

function onComments(data) {

    data.title = $('#' + data.title_id).text();

    var t = $.Mustache.render('post-header-template', data);

    $('#header_main').html(t);
    $('#header_main').toolbar('refresh');

	$('#btn_feed').click(function() { onFeed(data); });
	
	$('#footer_main').toolbar('hide');
	
	showCommentsPage(data);
}

function showCommentsPage(data) {
    var t = $.Mustache.render('post-page-template', data);

    createCommentsPage(t);

    var content = $('#' + data.content_id).html();
    $('#inner_' + data.content_id).html(content);

    var id = '#' + 'post_page' + ' .main-content .comments-list';

    $.mobile.loading('show');

    $.livejournal.getcomments(window.lj_conf.journal, data.itemid, data.anum, addComment, id, doneLC);
}

function doneLC() {
    $.mobile.loading('hide');
}

function createCommentsPage(data) {
    var page = activePage();
    page.before(data);

    $.mobile.pageContainer.pagecontainer('change', page.prev('[data-role=page]'), {
	    transition: 'slide'
    });
}

function addComment(comment, id) {

//    console.log(comment);

    var r_body_id = 'body_' + comment.dtalkid;
    var r_children_id = 'children_' + comment.dtalkid;

    var comment_data = {
        date       : formatUnixDate(comment.datepostunix),
        body_id    : r_body_id,
        body       : formatBody(comment, r_body_id, id),
        poster     : formatPoster(comment),
        children_id: r_children_id
    };

    var t = $.Mustache.render('post-template', comment_data);

    $(id).append(t).enhanceWithin();

    $('.post-item .ui-collapsible-content').autumn();

    $(id).listview('refresh');

    addChildren(comment, '#' + r_children_id);
}

function addChildren(comment, id) {
    if (comment.hasOwnProperty('children')) {
//        console.log('addChildren!!!');

        var r_list_id = 'list_' + comment.dtalkid;

        var list_data = {
            list_id: r_list_id
        };

        var t = $.Mustache.render('comments-area-template', list_data);

        $(id).append(t).enhanceWithin();

	    $.each( comment.children, function( i, item ) {
		    addComment(item, '#' + r_list_id);
	    });
    }
}

function formatUnixDate(sec) {
    var d = new Date(sec*1000);
    return $.format.date(d, 'dd MMM yyyy, hh:mm p');
}

function formatBody(comment, id, parent_id) {
    if (comment.hasOwnProperty('body')) {
        array_buffer_to_string(comment.body, 
            function (string) {
			    $(parent_id + ' #' + id).append(string);
            }
        );
        return '';
    }
    return '.';
}

function formatPoster(comment) {
    if (comment.hasOwnProperty('postername')) {
        return comment.postername;
    }
    return '.';
}

