
// Comments parsing

function onComments(data) {

    data.title = $('#' + data.title_id).text();

    var t = $.Mustache.render('post-header-template', data);

    $('#header_main').html(t);
    $('#header_main').toolbar('refresh');

    var ft = $.Mustache.render('post-footer-template', data);

    $('#footer_main').html(ft);
    $('#footer_main').toolbar('refresh');
	
	$('#btn_feed').click(function() { onFeed(data); });
	$('#btn_more').click(function() { onMore(); });
    $('#btn_more').prop('disabled', true).addClass('ui-disabled');
	
	showCommentsPage(data);
}

function showCommentsPage(data) {
    var t = $.Mustache.render('post-page-template', data);

    createCommentsPage(t);

    setTimeout(function() {
        var content = $('#' + data.content_id).html();
        $('#inner_' + data.content_id).html(content);
    }, 0);    
    
    setTimeout(function() {
        $.mobile.loading('show');
    }, 0);    

    var id = '#' + 'post_page' + ' .main-content .comments-list';

    setTimeout(function() {
        $.livejournal.getcomments(window.db_journals.current, data.itemid, data.anum, id, addAllComments);
    }, 0);    
}

function createCommentsPage(data) {
    var page = activePage();
    page.before(data);

    $.mobile.pageContainer.pagecontainer('change', page.prev('[data-role=page]'), {
	    transition: 'slide'
    });
}

// Comments Controller

window.commentsController = {
    MAX_NUM : 10,
	data : null,
	current : 0,
	max : this.MAX_NUM,
    reset: function () {
        this.data = null;
        this.current = 0;
		this.max = this.MAX_NUM;
    },
    set: function () {
//        this.data = null;
        this.current = 0;
		this.max = this.max + this.MAX_NUM;
    },
    canAdd: function () {
        return this.max >= this.current;
    }  
};

function addAllComments(comments, id) {

    setTimeout(function() {
        window.commentsController.reset();
        window.commentsController.data = comments;
        var i = 0;
        addComment(i, window.commentsController.data, id);
    }, 0);
             
    setTimeout(function() {
        $.mobile.loading('hide');
    }, 0);
}

function addComment(i, comments, id) {

    if (i < comments.length) {
        window.commentsController.current++;
        console.log('addComment: num - ' + i + ' total - ' + comments.length + ' count - ' + window.commentsController.current);
        
        if (window.commentsController.canAdd()) {
        
            var r_body_id = 'body_' + comments[i].dtalkid;
            var r_children_id = 'children_' + comments[i].dtalkid;

		    var r_pic_cls = '';
		    var r_avatar = window.db_userpics.defpic;

		    if (comments[i].hasOwnProperty('postername')) {
			    var poster = comments[i].postername;
		        r_pic_cls = window.db_userpics.prefix + poster;
			    r_avatar = window.db_userpics.getUserPic(poster);
		    }

            var comment_data = {
			    pic_cls    : r_pic_cls,
			    avatar     : r_avatar,
                date       : formatUnixDate(comments[i].datepostunix),
                body_id    : r_body_id,
                body       : formatBody(comments[i], r_body_id, id),
                poster     : formatPoster(comments[i]),
                children_id: r_children_id
            };

            var t = $.Mustache.render('post-template', comment_data);

            $(id).append(t).enhanceWithin();

            $('.post-item .ui-collapsible-content').autumn();

            $(id).listview('refresh');

            setTimeout(function() {
                addChildren(comments[i], '#' + r_children_id);
            }, 0);
            
            setTimeout(function() {
                i++;
                addComment(i, comments, id);
            }, 0);
        }
        else {                
            $('#btn_more').prop('disabled', true).removeClass('ui-disabled');

            var t = $.Mustache.render('post-more-template');
            $(id).append(t).enhanceWithin();
            $(id).listview('refresh');
        }
    }
}

function onMore() {
    var list_id = '#' + 'post_page' + ' .main-content .comments-list';
    $(list_id).empty();
    $('#btn_more').prop('disabled', true).addClass('ui-disabled');

    window.commentsController.set();

    var i = 0;
    addComment(i, window.commentsController.data, list_id);
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

        setTimeout(function() {
            var i = 0;
            addComment(i, comment.children, '#' + r_list_id);
        }, 0);
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

