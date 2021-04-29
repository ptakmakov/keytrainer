function Load() {
    /**
    * Default URLs
    */
    function getJSON(url, callback) {
        // eslint-disable-next-line no-undef
        $.getJSON(url, callback);
    }
    return {
        layoutURL: '/json/en.json',
        tipsURL: '/json/en.tips.json',
        patternURL: '/node/en.pattern.js',
        layout(options, callback) {
            getJSON(this.layoutURL, callback);
        },
        pattern(options, callback) {
            getJSON(this.patternURL, callback);
        },
        tips(options, callback) {
            getJSON(this.tipsURL, callback);
        },
    };
}
export { Load as default };
