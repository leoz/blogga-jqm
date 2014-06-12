
// User Pics Storage

window.db_userpics = {
	prefix     : 'avatar-',
	defpic     : 'img/avatar.png',
	data_token : 'db_userpics',
    data       : null,
    addUserPic: function(data, user) {
		this.data[user] = {
			user : user,
			def  : this.defpic,
			data : data
		};

		watch(this.data[user], "def", function() {
			window.db_userpics.changeUserPic(window.db_userpics.data[user]);
		});

		this.setDefaultUserPic(user);

		console.log('User Pics Storage addUserPic : journals - ' + JSON.stringify(this.data));
		localStorage.setItem(this.data_token, JSON.stringify(this.data));
    },
    changeUserPic: function(obj) {
		console.log('Default user pic canged for ' + obj.user + ' to ' + obj.def);
		var id = 'img.' + window.db_userpics.prefix + obj.user;
		$(id).each(function(){
			console.log('Change image ' + id);
			$(this).attr('src', obj.def);
		});
	},
    setDefaultUserPic: function(user) {
		if (this.data) {
			if (this.data[user]) {
				if (this.data[user].data) {
				    if (this.data[user].data.hasOwnProperty('defaultpicurl')) {
						load_blob(this.data[user].data.defaultpicurl, user, 'defaultpicurl', function() {
							get_blob(user, 'defaultpicurl', function(blob) {
								window.db_userpics.setDefaultUserPicToBlob(window.db_userpics.data[user], blob);
							});
						});
					}
				}
			}
		}
	},
    setDefaultUserPicToBlob: function(obj, blob) {
		console.log('Set default user pic to blob');
		var url = window.URL.createObjectURL(blob);
		console.log('Default user pic BLOB - Object URL: ' + url);
		obj.def = url;
	},
    getUserPic: function(user) {
		console.log('User Pics Storage getUserPic : ' + user);
		if (this.data) {
			if (this.data[user]) {
				if (this.data[user].def) {
					return this.data[user].def;
				}
			}
			else {
				this.loadUserPic(user);
			}
		}
		return this.defpic;
	},
    loadUserPic: function(user) {
		console.log('User Pics Storage loadUserPic : ' + user);
		setTimeout(function() {
		    $.livejournal.getuserpics(user,
                                      function(data, name) { window.db_userpics.addUserPic(data, name); },
                                      function(name) { window.db_userpics.loadUserPicFailed(name); } );
		}, 0);    
	},
    loadUserPicFailed: function(user) {
		console.log('User Pics Storage loadUserPicFailed : ' + user);
	},
    remUserPic: function(user) {
		console.log('User Pics Storage remUserPic : ' + user);
		// Revoke URL for BLOB
		window.URL.revokeObjectURL(this.data[user].def);
		delete this.data[user];
		console.log('User Pics Storage remUserPic : journals - ' + JSON.stringify(this.data));
		localStorage.setItem(this.data_token, JSON.stringify(this.data));
    },
    init: function() {
		this.data = JSON.parse(localStorage.getItem(this.data_token));
		console.log('User Pics Storage init : userpics - ' + JSON.stringify(this.data));
		if (!this.data) {
			this.data = {};
		}
	},
    close: function() {
		$.each(this.data, function( i, item ) {
			console.log('User Pics Storage Close - removing pic : ' + item.user);
			window.URL.revokeObjectURL(item.def);
			item.def = null;
			delete item.data;
		});
		delete this.data;
		this.data = {};
		console.log('User Pics Storage Close : journals - ' + JSON.stringify(this.data));
		localStorage.setItem(this.data_token, JSON.stringify(this.data));
	}
};


