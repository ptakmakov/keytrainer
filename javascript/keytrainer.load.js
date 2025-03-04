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
// function Load() {
//     function getJSON(url, callback) {
//         // eslint-disable-next-line no-undef
//         $.getJSON(url, callback);
//     }
//     return {
//         /**
//         * Default URLs
//         */
//         layoutURL: '/json/en.json',
//         tipsURL: '/json/en.tips.json',
//         patternURL: '/node/en.pattern.js',
//         /**
//          * @method layout Load keytrainer layout
//          * @param {Object} options URL options {key:value}
//          * @param {function} callback callback function
//          */
//         layout(options, callback) {
//             getJSON(this.layoutURL, callback);
//         },
//         /**
//          * @method pattern Load keytrainer pattern
//          * @param {Object} options URL options {key:value}
//          * @param {function} callback callback function
//          */
//         pattern(options, callback) {
//             getJSON(this.patternURL, callback);
//         },
//         /**
//          * @method tips Load keytrainer tips
//          * @param {Object} options URL options {key:value}
//          * @param {function} callback callback function
//          */
//         tips(options, callback) {
//             getJSON(this.tipsURL, callback);
//         },
//     };
// }
// export { Load as default };
