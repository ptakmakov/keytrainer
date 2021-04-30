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
        keyboard: $(keyboardSelector),
        // eslint-disable-next-line no-undef
        pattern: $(patternSelector),
        // eslint-disable-next-line no-undef
        keytrainer: $(keytrainerSelector),
        // eslint-disable-next-line no-undef
        stopwatch: $(stopwatchSelector),
        // eslint-disable-next-line no-undef
        speedmeter: $(speedSelector),
        // eslint-disable-next-line no-undef
        missprints: $(missprintsSelector),
        // eslint-disable-next-line no-undef
        tips: $(tipsSelector),
    };
}
export { Controls as default };
