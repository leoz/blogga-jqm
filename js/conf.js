
// Configuration settings

window.lj_conf = {
    number : 10,
    count : 10,
    date : null,
    expanded : false,
    journal : null,
    reset: function () {
        this.number = 10;
        this.count = 10;
		this.date = '';
//        this.expanded = true;
//        this.journal = 'toronto-ru';
    },
    setJournal: function(journal) {
        this.number = 10;
        this.count = 10;
		this.date = '';
//		this.expanded = true;
        this.journal = journal;
    }
};

