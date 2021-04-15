function Load() {
    /**
    * Default URLs
    */
    function getJSON(url, callback) {
        // eslint-disable-next-line no-undef
        $.getJSON(url, callback);
    }
    return {
        layoutJSON: '/json/en.json',
        tipsJSON: '/json/en.tips.json',
        patternJSON: '/node/en.pattern.js',
        layout(options, callback) {
            getJSON(this.layoutJSON, callback);
        },
        pattern(options, callback) {
            getJSON(this.patternJSON, callback);
        },
        tips(options, callback) {
            getJSON(this.tipsJSON, callback);
        },
    };
}
export { Load as default };
