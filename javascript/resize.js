/**
 * Document elements selectors
 */
const bodySelector = "body";
/**
 * Set width ratio for size scaling
 * @property {Number} widthRatio
 * @return {Object}
 * @property {Number} value
 */
let widthRatio = () => { return { value: 6.5 }; }

let resizeTimeout;
let initialFontSize;
/**
 * Resize page, default depends from window.innerWidth
 * size depends from document.body font size in percents
 * @param {Number} size window.innerWidth by default
 */
function Resize(size) {
    let r = widthRatio.value;
    if (!initialFontSize) initialFontSize = $(bodySelector).css("font-size");
    size = size / r;
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() =>
        $(bodySelector).css("font-size",
            ((size > r * 20) ?
                r * 20 :
                (size <= r * 10) ?
                    r * 10 : size) + "%"
        ), 12);
}
export { Resize, widthRatio }