/**
 * Document elements selectors
 */
const keyboardSelector = '.keyboard';
const patternSelector = '.keytrainer-pattern';
const keytrainerSelector = '.keytrainer';
const stopwatchSelector = '.stopwatch';
const speedSelector = '.speed';
const missprintsSelector = '.missprints';
const tipsSelector = '.tips';
/**
 * Controls return object with document elements for:
 * keyboard, pattern, keytrainer, stopwatch, speedmeter, missprints and tips
 * @returns {Object} Controls
 */
function Controls() {
    return {
        keyboard: document.querySelector(keyboardSelector),
        pattern: document.querySelector(patternSelector),
        keytrainer: document.querySelector(keytrainerSelector),
        stopwatch: document.querySelector(stopwatchSelector),
        speedmeter: document.querySelector(speedSelector),
        missprints: document.querySelector(missprintsSelector),
        tips: document.querySelector(tipsSelector),
    };
}
export { Controls as default };
