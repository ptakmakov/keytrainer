/* eslint-disable import/extensions, no-undef */
import { backslash, Keyboard } from './keytrainer.keyboard.js';
import Stopwatch from './stopwatch.js';
import { resize, widthRatio } from './resize.js';
import Controls from './keytrainer.controls.js';
import Tips from './keytrainer.tips.js';
import Load from './keytrainer.load.js';
import Pattern from './keytrainer.pattern.js';
import * as css from './keytrainer.css.js';

let keytrainer;
/**
 * Tips identificators
 */
const tipNewphrase = 'newphrase';
const tipMissprint = 'missprint';
const tipRandom = 'random';

/**
 * keyboardready event
 * @event keyboardready
 * @fires () assign keyboard.keys to keyitrainer.keys
 */
const keyboardready = document.createEvent('Event');
keyboardready.initEvent('keyboardready', true, true);
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
    $(window).on('blur', () => keytrainer.freeKeys());
});
document.addEventListener('keyboardready', () => {
    let i = 0; i += 1; return i;
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
        load.tips(null, (data) => {
            tips.tips = data;
        });

        keyboard.keyboardElement = controls.keyboard;
        load.layout(null, (data) => {
            keyboard.init(data, () => {
                document.dispatchEvent(keyboardready);
            });
        });

        pattern.pattern = controls.pattern;
        pattern.keytrainer = controls.keytrainer;
        load.pattern(null, (data) => {
            pattern.template = data.pattern;
        });

        stopwatch.delay = 5;
        stopwatch.format = 'mm:ss';
        stopwatch.stopwatch = controls.stopwatch;
        stopwatch.speedmeter = controls.speedmeter;
    } init();
    return {
        /**
         * Current position of pattern last typed symbol
         * @property {number} position
         */
        position: 0,
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
         * Unhighlight keytrainer pattern current char and print user input
         * Unhighlight keytrainer keyboard previous key
         * @method renderPatternCurrentChar
         * @param {string} input Pressed keyboard key value
         */
        renderPatternCurrentChar(input) {
            const patternItem = this.pattern[this.position];

            this.findKey(patternItem.char).highlightKey();
            patternItem.charElement
                .toggleClass(css.highlighted)
                .toggleClass(css.typed);
            if (patternItem.char === ' ') patternItem.charElement.html(' ');

            patternItem.input = input;
            patternItem.inputElement
                .html(
                    (input === ' ')
                        ? '&nbsp;'
                        : input,
                )
                .toggleClass(css.highlighted);

            if (input !== patternItem.char) {
                patternItem.inputElement.toggleClass(css.etext);
                missprints += 1;
                controls.missprints.html(String(missprints).padStart(2, '0'));
            }
        },
        /**
         * Highlight next char in keytrainer pattern and input
         * Highlight keytrainer keyboard next key
         * @method renderPatternNextChar
         */
        renderPatternNextChar() {
            const patternItem = this.pattern[this.position];

            this.findKey(patternItem.char).highlightKey();

            if (patternItem.char === ' ') {
                patternItem.inputElement.html('_');
                patternItem.charElement.html('_');
            } else {
                patternItem.inputElement.html(patternItem.char);
            }

            patternItem.inputElement.toggleClass(css.highlighted);
            patternItem.charElement
                .toggleClass(css.highlighted)
                .toggleClass(css.type);
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
                if (this.position < this.pattern.length) {
                    this.startStopwatch();

                    if (!key.isSpecial || key.lowercaseKey === 'Space') {
                        this.renderPatternCurrentChar(input);
                        this.position += 1;

                        if (this.position < this.pattern.length) this.renderPatternNextChar();
                        else {
                            stopwatch.stop();
                            this.renderTip(tipNewphrase);
                            this.findKey(' ').highlightKey();
                        }
                    }
                } else if (input === ' ') {
                    this.getJSON(patternJSON, (data) => {
                        this.getPattern(
                            data, () => {
                                this.renderTip();
                                this.findKey(' ').highlightKey();
                            },
                        );
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
            const key = this.findKey(e.key, e.code);
            if (!key) return;
            if (e.type === 'keydown') this.keyDown(key, e.key);
            if (e.type === 'keyup') this.keyUp(key);
        },
        /**
         * Get JSON and create pattern and keytrainer HTML elements
         * @method getPattern
         * @param {JSON} data JSON whith keyboard layout
         * @param {function} callback called when ready
         */
        getPattern(data, callback) {
            this.pattern = [];
            this.position = 0;
            controls.pattern.html('');
            controls.keytrainer.html('');
            controls.missprints.html('00');
            missprints = 0;
            stopwatch.stop();
            stopwatchStarted = false;
            this.pattern = Array.from(data.pattern).map((c, i) => {
                const isFirst = i === 0;
                if (isFirst) this.findKey(c).highlightKey();
                return {
                    char: c,
                    input: null,
                    charElement: $('<span/>')
                        .text(c)
                        .addClass((isFirst) ? css.highlighted : css.type)
                        .appendTo(controls.pattern),
                    inputElement: $('<span/>')
                        .text((isFirst) ? c : null)
                        .addClass((isFirst) ? css.highlighted : null)
                        .appendTo(controls.keytrainer),
                };
            });
            callback();
        },
        // /**
        //  * Load tips JSON for selected language
        //  * @method getTips
        //  * @param {JSON} data tips JSON
        //  * @param {function} callback callback function
        //  */
        // getTips(data, callback) {
        //     tips.tips = data;
        //     callback();
        // },
        /**
         * Render tip from selected language based JSON
         * @method renderTip
         * @param {string} identifier Tips identifier in JSON
         */
        renderTip(identifier) {
            if (this.tips) {
                if (!identifier) {
                    controls.tips.html(tips.getTip(tipRandom));
                }
                if (identifier) controls.tips.html(tips.getTip(identifier));
                if (identifier === tipMissprint) controls.tips.addClass(css.etext);
                else controls.tips.removeClass(css.etext);
            }
        },
        /**
         * Unpress all pressed keys for example when window focused out
         * @method freeKeys
         */
        freeKeys() {
            if (keyboard.keys) {
                keyboard.keys
                    .filter((v) => v.isDown)
                    .forEach((v) => v.toggleKey());
            }
        },
        /**
         * Search key by char or keyCode returned by event object
         * @param {string} char
         * @param {string} keyCode
         * @returns {object} Returns keyboard key object @see {Key}
         */
        findKey(char, keyCode) {
            if (keyboard.keys) {
                return keyboard.keys.filter(
                    (k) => ((k.isSpecial && char !== ' ')
                        ? k.lowercaseKey === keyCode
                        : k.lowercaseKey === char || k.uppercaseKey === char),
                )[0];
            }
            return null;
        },
        get preventDefault() { return preventDefault; },
        set preventDefault(value) { preventDefault = value; },
    };
}
