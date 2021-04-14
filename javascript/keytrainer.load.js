function Load() {
    /**
    * Default URLs
    */
    const layoutJSON = '/json/en.json';
    const tipsJSON = '/json/en.tips.json';
    const patternJSON = '/node/pattern.js';
    function getJSON(url, callback) {
        // eslint-disable-next-line no-undef
        $.getJSON(url, callback);
    }
    return {
        layout(options, callback) {
            getJSON(layoutJSON, callback);
        },
        pattern(options, callback) {
            getJSON(patternJSON, callback);
        },
        tips(options, callback) {
            getJSON(tipsJSON, callback);
        },
    };
}
export { Load as default };
