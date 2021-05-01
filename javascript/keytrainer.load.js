/**
 * Load sources for keytrainer
 * @typedef Load
 * @returns {Object} Load
 */
function Load() {
    function getJSON(url, callback) {
        // eslint-disable-next-line no-undef
        $.getJSON(url, callback);
    }
    return {
        /**
        * Default URLs
        */
        layoutURL: '/json/en.json',
        tipsURL: '/json/en.tips.json',
        patternURL: '/node/en.pattern.js',
        /**
         * @method layout Load keytrainer layout
         * @param {Object} options URL options {key:value}
         * @param {function} callback callback function
         */
        layout(options, callback) {
            getJSON(this.layoutURL, callback);
        },
        /**
         * @method pattern Load keytrainer pattern
         * @param {Object} options URL options {key:value}
         * @param {function} callback callback function
         */
        pattern(options, callback) {
            getJSON(this.patternURL, callback);
        },
        /**
         * @method tips Load keytrainer tips
         * @param {Object} options URL options {key:value}
         * @param {function} callback callback function
         */
        tips(options, callback) {
            getJSON(this.tipsURL, callback);
        },
    };
}
export { Load as default };
