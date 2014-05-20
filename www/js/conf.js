
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
        var t = $.format.date(d, this.format);
        this.date = t;
    },
    setCurrentCount: function() {
		var num = parseInt($( window ).height() / 54) - 2;
        this.number = num;
        this.count = num;
    },
    reset: function () {
        this.setCurrentDate();
        this.setCurrentCount();
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

