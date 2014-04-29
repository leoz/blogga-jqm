
// Configuration settings

window.lj_conf = {
    format : 'yyyy-MM-dd HH:mm:ss',
    number : 10,
    count : 10,
    date : null,
    expanded : false,
    journal : null,
    setCurrentDate: function() {
        this.date = $.format.date(new Date(), this.format);
    },
    reset: function () {
        this.setCurrentDate();
        this.number = 10;
        this.count = 10;
    },
    setJournal: function(journal) {
        this.reset();
        this.journal = journal;
    }
};

