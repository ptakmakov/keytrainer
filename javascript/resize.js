/**
 * Document elements selectors
 */
const bodySelector = document.body;
/**
 * Set or get width ratio for size scaling in percents widthRatio*2 < size < widthRatio
 * @returns {Object}
 * @property {Number} value
 * @default 65
 */
const widthRatio = () => ({
    value: 65,
});

/**
 * Set or get screen width for size scaling in pixels
 * @returns {Object}
 * @property {Number} value
 * @default 1280
 */
const screenWidth = () => ({
    value: 1280,
});

/**
 * windowTimeout, used for deferred resize
 * @private {windowTimeout} resizeTimeout
 */
let resizeTimeout;
/**
 * Resize page, by default depends from window.innerWidth
 * size depends from document.body font size in percents
 * @param {Number} size window.innerWidth by default
 */
function resize(size) {
    const r = widthRatio.value;
    const aspect = (size * 10000) / (screenWidth.value * r);
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        bodySelector.style.fontSize = (() => {
            if (aspect > r * 2) return `${r * 2}%`;
            if (aspect <= r) return `${r}%`;
            return `${aspect}%`;
        })();
    }, 12);
}
export { resize, widthRatio, screenWidth };
