module.exports = {
    t0: 0,
    t1: 0,
    text : "execution time: ",
    start: function(txt) {
        this.text = txt;
        this.t0 = performance.now();
    },
    stop: function() {
        this.t1 = performance.now();
        console.log(this.text+': '+(this.t1 - this.t0).toFixed(4)+'ms');
    }
};