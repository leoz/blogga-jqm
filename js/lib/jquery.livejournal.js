
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
                success(lj_method, response, status);
	        },
            error: function(jqXHR, status, error) {
                error(lj_method, status, error);
	        }
        });
    };
    
    $.livejournal.getevents = function(date, user, count, cb_event, id, cb_done) {
        var lj_method = 'LJ.XMLRPC.getevents';
	    $.xmlrpc({
	        url: LJ_URL,
	        methodName: lj_method,
	        params: [ {
			    'ver' : '1',
			    'selecttype' : 'lastn',
			    'howmany' : count,
                'usejournal' : user,
                'beforedate' : date
		    } ],
	        success: function(response, status, jqXHR) {
	            success(lj_method, response, status);
			    $.each( response[0].events, function( i, item ) {
				    cb_event(item, user, id);
			    });
                var count = response[0].events.length;
                var date = ((count > 0) ? response[0].events[count-1].eventtime : '');
                cb_done(count, date);
		    },
	        error: function(jqXHR, status, error) {
                error(lj_method, status, error);
		    }
	    });
    }
    
    // Global Private Variables
    var LJ_URL = 'http://www.livejournal.com/interface/xmlrpc';
    var LJ_DEBUG = true;
    
    // Global Private Functions        
    function success(method, response, status) {
        if (LJ_DEBUG) {
            console.log(response);
            console.log(status);
            console.log(method + ' - success');
        }
    }

    function error(method, status, error) {
        if (LJ_DEBUG) {
            console.log(status);
            console.log(error);
            console.log(method + ' - error');
        }
    }
})(jQuery);

