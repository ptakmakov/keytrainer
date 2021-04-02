/**
 * Document elements selectors
 */
const bodySelector = 'body';
/**
 * Set width ratio for size scaling
 * @property {Number} widthRatio
 * @return {Object}
 * @property {Number} value
 */
const widthRatio = () => ({ value: 6.5 });

let resizeTimeout;
let initialFontSize;
/**
 * Resize page, default depends from window.innerWidth
 * size depends from document.body font size in percents
 * @param {Number} size window.innerWidth by default
 */
function resize(size) {
    const r = widthRatio.value;
    // eslint-disable-next-line no-undef
    if (!initialFontSize) initialFontSize = $(bodySelector).css('font-size');
    const aspect = size / r;
    if (resizeTimeout) clearTimeout(resizeTimeout);
    // eslint-disable-next-line no-undef
    resizeTimeout = setTimeout(() => $(bodySelector).css('font-size',
        () => {
            if (aspect > r * 20) return `${r * 20}%`;
            if (aspect <= r * 10) return `${r * 10}%`;
            return `${aspect}%`;
        }, 12));
}
export { resize, widthRatio };
