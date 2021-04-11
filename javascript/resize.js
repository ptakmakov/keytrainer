/**
 * Document elements selectors
 */
const bodySelector = 'body';
/**
 * Set width ratio for size scaling in percents widthRatio*2 < size < widthRatio
 * @property {Number} widthRatio
 * @return {Object}
 * @property {Number} value
 */
const widthRatio = () => ({ value: 65 });

/**
 * ToDo: Timeout for animate resize
 * @private {windowTimeout} resizeTimeout
 */
let resizeTimeout;
/**
 * Resize page, default depends from window.innerWidth
 * size depends from document.body font size in percents
 * @param {Number} size window.innerWidth by default
 * ToDo: animation callback
 */
function resize(size) {
    const r = widthRatio.value;
    const aspect = (size * 100) / r;
    if (resizeTimeout) clearTimeout(resizeTimeout);
    // eslint-disable-next-line no-undef
    resizeTimeout = setTimeout(() => $(bodySelector).css('font-size',
        () => {
            if (aspect > r * 2) return `${r * 2}%`;
            if (aspect <= r) return `${r}%`;
            return `${aspect}%`;
        }, 12));
}
export { resize, widthRatio };
