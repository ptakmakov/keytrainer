/**
 * Load sources for keytrainer
 * @typedef Load
 * @returns {Object} Load
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
        // eslint-disable-next-line no-console
        .catch((error) => console.error('Ошибка при загрузке JSON:', error));
}
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
