
// Configuration settings

window.lj_conf = {
    format : 'yyyy-MM-dd HH:mm:ss',
    number : 10,
    count : 10,
    date : null,
    expanded : false,
    data : {},
    setCurrentDate: function() {
		this.date = null;
    },
    setCurrentCount: function() {
		var num = parseInt(getContentHeight() / em(5)) + 1;
        this.number = num;
        this.count = num;
    },
    reset: function () {
        this.setCurrentDate();
        this.setCurrentCount();
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

function em(input) {
    var emSize = parseFloat($('body').css('font-size'));
    return (emSize * input);
}

