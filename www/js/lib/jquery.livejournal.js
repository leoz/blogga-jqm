
(function($) {
    "use strict";

    $.livejournal = function() {
    };
    
    $.livejournal.getchallenge = function() {
        var lj_method = 'LJ.XMLRPC.getchallenge';
        $.xmlrpc({
            url: LJ_URL,
            methodName: lj_method,
            params: [],
            success: function(response, status, jqXHR) {
                log_success(lj_method, response, status);
	        },
            error: function(jqXHR, status, error) {
                log_error(lj_method, status, error);
	        }
        });
    }

    $.livejournal.getuserpics = function(user, callback, cb_failed) {
        var lj_method = 'LJ.XMLRPC.getuserpics';
		var lj_url = LJ_URL;
		if (LJ_TEST) {
		    lj_url = LJ_TEST_PATH + 'userpics.xml';
		}
	    $.xmlrpc({
	        url: lj_url,
	        methodName: lj_method,
	        params: [ {
			    'ver'        : '1',
                'usejournal' : user
		    } ],
	        success: function(response, status, jqXHR) {
	            log_success(lj_method, response, status);
	            callback(response[0], user);
		    },
	        error: function(jqXHR, status, error) {
                cb_failed(user);
                log_error(lj_method, status, error);
		    }
	    });
    }
    
    $.livejournal.getevents = function(date, user, count, id, callback) {
        var lj_method = 'LJ.XMLRPC.getevents';
		var params = {
			    'ver'        : '1',
			    'selecttype' : 'lastn',
			    'howmany'    : count,
                'usejournal' : user
		};
		if (date) {
			params['beforedate'] = date;
		}
		var lj_url = LJ_URL;
		if (LJ_TEST) {
		    lj_url = LJ_TEST_PATH + 'events.xml';
		}
	    $.xmlrpc({
	        url: lj_url,
	        methodName: lj_method,
			params: [ params ],
	        success: function(response, status, jqXHR) {
	            log_success(lj_method, response, status);
	            callback(response[0].events, user, id);
		    },
	        error: function(jqXHR, status, error) {
                log_error(lj_method, status, error);
		    }
	    });
    }

    $.livejournal.getcomments = function(user, itemid, anum, id, callback) {
        var ditemid = itemid * 256 + anum;
        var lj_method = 'LJ.XMLRPC.getcomments';
		var lj_url = LJ_URL;
		if (LJ_TEST) {
		    lj_url = LJ_TEST_PATH + 'comments.xml';
		}        
	    $.xmlrpc({
	        url: lj_url,
	        methodName: lj_method,
	        params: [ {
			    'ver'     : '1',
                'journal' : user,
                'ditemid' : ditemid
		    } ],
	        success: function(response, status, jqXHR) {
	            log_success(lj_method, response, status);
	            callback(response[0].comments, id);
		    },
	        error: function(jqXHR, status, error) {
                log_error(lj_method, status, error);
		    }
	    });
    }    
    
    // Global Private Variables
    var LJ_URL = 'http://www.livejournal.com/interface/xmlrpc';
    var LJ_DEBUG = true;
    var LJ_TEST_PATH = 'js/lib/test/'; // Change this path to match your app. structure
    var LJ_TEST = false;
    
    // Global Private Functions        
    function log_success(method, response, status) {
        if (LJ_DEBUG) {
            console.log(response);
            console.log(status);
            console.log(method + ' - success');
        }
    }

    function log_error(method, status, error) {
        if (LJ_DEBUG) {
            console.log(status);
            console.log(error);
            console.log(method + ' - error');
        }
    }
})(jQuery);

