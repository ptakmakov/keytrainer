/* eslint-disable import/extensions, no-undef */
import Keyboard, { backslash } from './keytrainer.keyboard.js';
import Stopwatch from './stopwatch.js';
import { resize, widthRatio } from './resize.js';
import Controls from './keytrainer.controls.js';
import Tips, { tipskeys } from './keytrainer.tips.js';
import Load from './keytrainer.load.js';
import Pattern from './keytrainer.pattern.js';
// import * as css from './keytrainer.css.js';

let keytrainer;
/**
 * patternready event
 * @event patternready
 * @fires Keytrainer.trackKey(e)
 */
const patternready = document.createEvent('Event');
patternready.initEvent('patternready', true, true);

document.addEventListener('patternready', () => {
    $(window).on('keypress keydown keyup', (e) => keytrainer.trackKey(e));
    $(window).on('resize', () => resize(window.innerWidth));
});
$(document).ready(
    () => {
        backslash.value = '\\';
        // eslint-disable-next-line no-use-before-define
        window.keytrainer = new Keytrainer();
        keytrainer = window.keytrainer;
        widthRatio.value = 65;
        resize(window.innerWidth);
    },
);
/**
 * Object controls user input, compares it with pattern, counts
 * speed and mistakes, teaches for blind keyboard typing
 * @typedef Keytrainer
 * @returns {object} Keytrainer
 */
function Keytrainer() {
    /**
     * load
     * @private
     * @property {object} load Loads necessary JSON sources
     */
    const load = new Load();
    /**
     * controls
     * @private
     * @property {object} controls HTML controls for keyboard simulator
     */
    const controls = new Controls();
    /**
     * keyboard
     * @private
     * @property {object} keyboard Renders keyboard, create keys array of objects key
     * @see Keyboard.keys
     */
    const keyboard = new Keyboard();
    /**
     * stopwatch
     * @private
     * @property {object} stopwatch Renders stopwatch
     * @see Stopwatch
     */
    const stopwatch = new Stopwatch();
    /**
     * tips
     * @private
     * @property {object} tips Contains object with tips, errors and other informational phrases
     * @see Tips
     */
    const tips = new Tips();
    /**
     * keys
     * @private
     * @property {Array[{object}]} keys Keyboard keys @see Keyboard
     */
    const pattern = new Pattern();
    let preventDefault = true;
    let missprints = 0;
    let stopwatchStarted = false;
    function init() {
        tips.tip = controls.tips;
        load.tips(null, (data) => {
            tips.tips = data;
            tips.renderTip(tipskeys.random);
        });

        keyboard.keyboardElement = controls.keyboard;
        load.layout(null, (data) => {
            keyboard.init(data);
        });

        load.pattern(null, (data) => {
            pattern.template = data.pattern;
            keyboard.highlightKey(pattern.next);
            $(window).on('blur', () => keyboard.freeKeys());
            document.dispatchEvent(patternready);
        });

        stopwatch.delay = 5;
        stopwatch.format = 'mm:ss';
        stopwatch.stopwatch = controls.stopwatch;
        stopwatch.speedmeter = controls.speedmeter;
    } init();
    return {
        /**
         * Starts counting typing speed
         * @method startStopwatch
         */
        startStopwatch() {
            if (!stopwatchStarted) {
                stopwatch.reset();
                stopwatch.start();
                stopwatch.quantity = 0;
                stopwatchStarted = true;
            }
            stopwatch.quantity += 1;
        },
        /**
         * Toggle key pressed when fires keyup event
         * Starts stopwatch and typing speed counter
         * Controls keytrainer pattern and input
         * @method keyDown
         * @param {object} key Key object @see {Key}
         * @param {string} input Pressed keyboard key value
         */
        keyDown(key, input) {
            if (!key.isDown) {
                if (!pattern.isLast) {
                    this.startStopwatch();

                    if (!key.isSpecial || key.lowercaseKey === 'Space') {
                        if (input !== pattern.next) {
                            missprints += 1;
                            controls.missprints.html(String(missprints).padStart(2, '0'));
                        }
                        keyboard.highlightKey(pattern.next);
                        pattern.renderCurrent(input);

                        if (!pattern.isLast) {
                            pattern.renderNext();
                            keyboard.highlightKey(pattern.next);
                        } else {
                            stopwatch.stop();
                            tips.renderTip(tipskeys.newphrase);
                            keyboard.highlightKey(' ');
                        }
                    }
                } else if (input === ' ') {
                    load.pattern(null, (data) => {
                        pattern.template = data.pattern;
                        tips.renderTip(tipskeys.random);
                        keyboard.highlightKey(' ');
                        keyboard.highlightKey(pattern.next);
                    });
                }
                key.toggleKey();
            }
        },
        /**
         * Toggle key unpressed when fires keyup event
         * @method keyUp
         * @param {object} key Key object @see {Key}
         */
        keyUp(key) {
            if (key.isDown) {
                key.toggleKey();
            }
        },
        /**
         * Tracks events keydown, keypress, keyup
         * Controlls keyboard behavior
         * @method trackKey
         * @param {Event} e keyboard event
         */
        trackKey(e) {
            if (this.preventDefault) e.preventDefault();
            const key = keyboard.findKey(e.key, e.code);
            if (!key) return;
            if (e.type === 'keydown') this.keyDown(key, e.key);
            if (e.type === 'keyup') this.keyUp(key);
        },
        get preventDefault() { return preventDefault; },
        set preventDefault(value) { preventDefault = value; },
    };
}
