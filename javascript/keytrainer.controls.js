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
function Controls() {
    return {
        // eslint-disable-next-line no-undef
        keyboard: document.querySelector(keyboardSelector),
        // eslint-disable-next-line no-undef
        pattern: document.querySelector(patternSelector),
        // eslint-disable-next-line no-undef
        keytrainer: document.querySelector(keytrainerSelector),
        // eslint-disable-next-line no-undef
        stopwatch: document.querySelector(stopwatchSelector),
        // eslint-disable-next-line no-undef
        speedmeter: document.querySelector(speedSelector),
        // eslint-disable-next-line no-undef
        missprints: document.querySelector(missprintsSelector),
        // eslint-disable-next-line no-undef
        tips: document.querySelector(tipsSelector),
    };
}
export { Controls as default };
