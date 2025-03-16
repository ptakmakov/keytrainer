/**
 * Get JSON from URL
 * @param {string} url - URL
 * @param {function} callback - Callback
 */
function getJSON(url, callback) {
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => callback(data))
        .catch((error) => { throw new Error(`Ошибка при загрузке JSON: ${error}`); });
}
/**
 * Load sources for keytrainer
 * @typedef Load
 * @returns {Object} Load
 */
function Load() {
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
