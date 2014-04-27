
// Configuration settings

window.lj_conf = {
    number : 10,
    count : 10,
    date : '',
    journal : 'toronto-ru',
    reset: function () {
        this.number = 10;
        this.count = 10;
		this.date = '';
        this.journal = 'toronto-ru';
    },
    setJournal: function(journal) {
        this.number = 10;
        this.count = 10;
		this.date = '';
        this.journal = journal;
    }
};

