
// Blobs Storage

window.db_blobs = {
	db_name : 'db_blobs',
    db      : null,
    init: function() {
		this.db = new PouchDB(this.db_name);
	},
    close: function() {
		this.db.destroy();
	}
};

////////////
// PUT BLOB

function put_blob(blob, parent, id, callback) {
	window.db_blobs.db.getAttachment(parent, id, function(err, res) {
		if (err) {
		    if (err.status = '404') {
				console.log('BLOB is not yet stored');
				int_put_blob(blob, parent, id, callback);
		    }
			else {
				console.log('Error retrieving BLOB');
			}
		} else {
			console.log('BLOB is already stored');
			callback();
		}
	});
}

function int_put_blob(blob, parent, id, callback) {
	var type = blob.type;
	var rev = '1.0';
	window.db_blobs.db.putAttachment(parent, id, rev, blob, type, function(err, res) {
		if (err) {
			console.error('Cannot store BLOB. Error: ' + err.error +
                          ' reason: ' + err.reason +
                          ' status: ' + err.status);
		} else {
			console.log('BLOB stored successfully: ', res.id + ' rev: ' + res.rev);
			callback();
		}
	});
}

////////////
// GET BLOB

function get_blob(parent, id, callback) {
	window.db_blobs.db.getAttachment(parent, id, function(err, res) {
		if (err) {
			console.error('Cannot find BLOB id: ' + id +
                          ' error: ' + err.error +
                          ' reason: ' + err.reason +
                          ' status: ' + err.status);
		} else {
			console.log('BLOB retrieved OK');
			callback(res);
		}
	});
}

////////////
// LOAD BLOB

function load_blob(url, parent, id, callback) {

	$.ajax({
		dataType: 'blob',
		type: 'GET',
		url: url
	})
	.done(function(blob) {
		console.log('BLOB load - success: ' + url);
		put_blob(blob, parent, id, callback);
	})
	.fail(function() {
		console.log('BLOB load - error: ' + url);
	})
	.always(function() {
		console.log('BLOB load - complete: ' + url);
	});
}

////////////

