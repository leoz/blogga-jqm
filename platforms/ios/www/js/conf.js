
// Configuration settings

window.lj_conf = {
    format : 'yyyy-MM-dd HH:mm:ss',
    number : 10,
    count : 10,
    date : null,
    expanded : false,
    journal : null,
    data : {},
    setCurrentDate: function() {
        var d = new Date();
        // This is a hack to get all the latest posts
        d.setTime(d.getTime() + 43200000);
        var t = $.format.date(d, this.format);
        this.date = t;
    },
    reset: function () {
        this.setCurrentDate();
        this.number = 10;
        this.count = 10;
    },
    setJournal: function(journal) {
        this.reset();
        this.journal = journal;
    },
    getPageDate: function(page) {
        if (!this.data[page]) {
            console.log('getPageDate - NOT found page ' + page);
            this.data[page] = this.date;
        }
        else {
            console.log('getPageDate - found page ' + page);
            this.date = this.data[page];
        }
        console.log('getPageDate: data - ' + this.data[page]);
        return this.data[page];
    }
};

