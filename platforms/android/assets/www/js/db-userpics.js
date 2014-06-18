
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
			data : data,
			pics : null
		};

		this.convertPics(user);

		watch(this.data[user], "def", function() {
			window.db_userpics.changeDefaultUserPic(window.db_userpics.data[user]);
		});

		this.setDefaultUserPic(user);

		console.log('User Pics Storage addUserPic : journals - ' + JSON.stringify(this.data));
		localStorage.setItem(this.data_token, JSON.stringify(this.data));
    },
    convertPics: function(user) {
		console.log('### User Pics Storage - convertPics. Input: ');
		console.log(this.data[user].data);

		if (this.data[user].data.pickws) {
			$.each(this.data[user].data.pickws, function(index, value) {
				array_buffer_to_string(value, function (s) {
					window.db_userpics.data[user].data.pickws[index] = s;
				});
			});
		}
		console.log('### User Pics Storage - convertPics. Result: ');
		console.log(this.data[user].data);
	},
    changeDefaultUserPic: function(obj) {
		console.log('Default user pic canged for ' + obj.user + ' to ' + obj.def);
		var id = 'img.ava[alt="' + window.db_userpics.prefix + obj.user + '"]';
		$(id).each(function(){
			console.log('Change image ' + id);
			$(this).attr('src', obj.def);
		});
	},
    changeCustomUserPic: function(obj, key) {
		console.log('Custom user pic canged for ' + obj.user + ' to ' + obj.pics[key]);
		var id = 'img.ava[alt="' + window.db_userpics.prefix + obj.user + '-' + key + '"]';
		$(id).each(function(){
			console.log('Change image ' + id);
			$(this).attr('src', obj.pics[key]);
		});
	},
    setDefaultUserPic: function(user) {
		if (this.data) {
			if (this.data[user]) {
				if (this.data[user].data) {
				    if (this.data[user].data.hasOwnProperty('defaultpicurl')) {
						if (this.data[user].data.defaultpicurl) {
							console.log('setDefaultUserPic - URL: ' + this.data[user].data.defaultpicurl);
							load_blob(this.data[user].data.defaultpicurl, user, 'defaultpicurl', function() {
								get_blob(user, 'defaultpicurl', function(blob) {
									window.db_userpics.setDefaultUserPicToBlob(window.db_userpics.data[user], blob);
								});
							});
						}
						else {
							console.log('setDefaultUserPic - URL is empty!');
						}
					}
				}
			}
		}
	},
    setCustomUserPic: function(user, key) {
		console.log('User Pics Storage setCustomUserPic : ' + user + ' ' + key);
		if (this.data) {
			if (this.data[user]) {
				if (this.data[user].data) {
					if (this.data[user].data.pickws) {
						$.each(this.data[user].data.pickws, function(index, value) {
							if (value == key) {
								console.log('Custom pic keyword found : ' + user + ' ' + key + ' ' + index);
								if (window.db_userpics.data[user].data.pickwurls) {
									if (window.db_userpics.data[user].data.pickwurls[index]) {
										console.log('Custom pic URL found : ' + window.db_userpics.data[user].data.pickwurls[index]);


							load_blob(window.db_userpics.data[user].data.pickwurls[index], user, index, function() {
								get_blob(user, index, function(blob) {
									window.db_userpics.setCustomUserPicToBlob(window.db_userpics.data[user], blob, key);
								});
							});


									}
								}
							}
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
    setCustomUserPicToBlob: function(obj, blob, key) {
		console.log('Set custom user pic to blob');
		var url = window.URL.createObjectURL(blob);
		console.log('Custom user pic BLOB - Object URL: ' + url);
		if (!obj.pics) {
			obj.pics = {};
		}
		obj.pics[key] = url;

//		watch(obj.pics, key, function() {
			window.db_userpics.changeCustomUserPic(window.db_userpics.data[obj.user], key);
//		});
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
    getCustomUserPic: function(user, key) {
		console.log('User Pics Storage getCustomUserPic : ' + user + ' ' + key);
		if (this.data) {
			if (this.data[user]) {
				if (this.data[user].pics) {
					if (this.data[user].pics[key]) {
						return this.data[user].pics[key];
					}
					else {
						this.setCustomUserPic(user, key);
					}
				}
				else {
					this.data[user].pics = {};
					this.setCustomUserPic(user, key);
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

function array_buffer_to_string(buf, callback) {

    var bb = new Blob([buf]);
    var f = new FileReader();
    f.onload = function(e) {
        callback(e.target.result)
    }
    f.readAsText(bb);
}

