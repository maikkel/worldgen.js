module.exports = (function () {
    var clamp = function(num, min, max) {
        return Math.min(Math.max(num, min), max);
    };

    return {
        clamp:clamp
    }
})();