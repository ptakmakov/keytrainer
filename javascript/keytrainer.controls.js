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
