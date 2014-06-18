
// Journals Storage

window.db_journals = {
	data_token    : 'db_journals',
	current_token : 'db_current',
    data          : null,
    current       : null,
    addJournal: function(name) {
		this.data[name] = name;
		console.log('Journals Storage addJournal : journals - ' + JSON.stringify(this.data));
		localStorage.setItem(this.data_token, JSON.stringify(this.data));
    },
    remJournal: function(name) {
		console.log('Journals Storage remJournal : ' + name);
		delete this.data[name];
		console.log('Journals Storage remJournal : journals - ' + JSON.stringify(this.data));
		localStorage.setItem(this.data_token, JSON.stringify(this.data));
    },
    setCurrent: function(name) {
		this.addJournal(name);
        this.current = name;
		localStorage.setItem(this.current_token, JSON.stringify(this.current));
    },
    init: function() {
		this.data = JSON.parse(localStorage.getItem(this.data_token));
		console.log('Journals Storage init : journals - ' + JSON.stringify(this.data));
		this.current = JSON.parse(localStorage.getItem(this.current_token));
		console.log('Journals Storage init : current - ' + this.current);
		if (!this.data || !this.current) {
			this.setDefaults();
		}
	},
    setDefaults: function() {
		this.data = {};
		this.setCurrent('toronto-ru');
		this.addJournal('tema');
		this.addJournal('russos');
		this.addJournal('tanyant');
		this.addJournal('leoz-net');
	},
    close: function() {
	}
};

