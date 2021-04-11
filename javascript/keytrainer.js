/* eslint-disable import/extensions, no-undef */
import { backslash, Keyboard } from './keytrainer.keyboard.js';
import Stopwatch from './stopwatch.js';
import { resize, widthRatio } from './resize.js';
import Controls from './keytrainer.controls.js';
import Tips from './keytrainer.tips.js';

let keytrainer;
/**
 * CSS classes, other CSS classes defined in json layout in first element of key array
 */
const highlightedCSS = 'highlighted';
const typeCSS = 'type';
const typedCSS = 'typed';
const etextCSS = 'e-text-c';
/**
* Default URLs
*/
const layoutJSON = '/json/en.json';
const tipsJSON = '/json/en.tips.json';
const patternJSON = '/node/pattern.js';
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
    keytrainer.keys = keytrainer.keyboard.keys;
    keytrainer.getJSON(patternJSON, (data) => {
        keytrainer.getPattern(data, () => document.dispatchEvent(patternready));
    });
});
$(document).ready(
    () => {
        backslash.value = '\\';
        const controls = new Controls();
        // prod
        // keytrainer = new Keytrainer();
        // dev
        // eslint-disable-next-line no-use-before-define
        window.keytrainer = new Keytrainer();
        keytrainer = window.keytrainer;
        keytrainer.getJSON = $.getJSON;
        keytrainer.controls = controls;
        keytrainer.tips = new Tips();
        keytrainer.getJSON(tipsJSON, (data) => {
            keytrainer.tips.tips = data;
            keytrainer.renderTip();
        });
        keytrainer.stopwatch = new Stopwatch();
        keytrainer.stopwatch.delay = 5;
        keytrainer.stopwatch.format = 'mm:ss';
        keytrainer.stopwatch.stopwatchElement = controls.stopwatch;
        keytrainer.stopwatch.speedmeterElement = controls.speedmeter;
        keytrainer.keyboard = new Keyboard();
        keytrainer.keyboard.keyboardElement = controls.keyboard;
        keytrainer.stopwatchElement = controls.stopwatch;
        keytrainer.speedmeterElement = controls.speedmeter;
        keytrainer.getJSON(layoutJSON, (data) => {
            keytrainer.keyboard.init(data, () => document.dispatchEvent(keyboardready));
        });
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
    let controls;
    let tips;
    let preventDefault = true;
    let missprints = 0;
    let stopwatchStarted = false;
    return {
        /**
         * HTML controls for keyboard simulator
         * @property {object} controls
         * @param {object} o
         */
        set controls(o) { controls = o; },
        set tips(o) { tips = o; },
        get tips() { return tips; },
        /**
         * Any JSON loader accepts URL and callback(JSON) function
         * @property {function} getJSON
         */
        getJSON: {},
        /**
         * jQuery object of keytrainer pattern HTML element
         * @property {object} patternElement
         */
        stopwatchElement: {},
        /**
         * jQuery object of keytrainer speedmeter HTML element
         * @property {object} speedmeterElement
         */
        speedmeterElement: {},
        /**
         * jQuery object of keyitrainer tips HTML element
         * @property {object} tipsElement
         */
        keyboard: null,
        /**
         * Stopwatch object
         * @property {object} stopwatch @see Stopwatch
         */
        stopwatch: null,
        /**
         * Keyboard keys
         * @property {Array({objects})} keys @see Keyboard.keys
         */
        keys: null,
        /**
         * Keytrainer pattern
         * @property {Array{objects}} pattern
         */
        pattern: null,
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
                this.stopwatch.reset();
                this.stopwatch.start();
                this.stopwatch.quantity = 0;
                stopwatchStarted = true;
            }
            this.stopwatch.quantity += 1;
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
                .toggleClass(highlightedCSS)
                .toggleClass(typedCSS);
            if (patternItem.char === ' ') patternItem.charElement.html(' ');

            patternItem.input = input;
            patternItem.inputElement
                .html(
                    (input === ' ')
                        ? '&nbsp;'
                        : input,
                )
                .toggleClass(highlightedCSS);

            if (input !== patternItem.char) {
                patternItem.inputElement.toggleClass(etextCSS);
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

            patternItem.inputElement.toggleClass(highlightedCSS);
            patternItem.charElement
                .toggleClass(highlightedCSS)
                .toggleClass(typeCSS);
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
                            this.stopwatch.stop();
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
         * Unpress all pressed keys for example when window focused out
         * @method freeKeys
         */
        freeKeys() {
            if (this.keys) {
                this.keys
                    .filter((v) => v.isDown)
                    .forEach((v) => v.toggleKey());
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
            this.stopwatch.stop();
            stopwatchStarted = false;
            this.pattern = Array.from(data.pattern).map((c, i) => {
                const isFirst = i === 0;
                if (isFirst) this.findKey(c).highlightKey();
                return {
                    char: c,
                    input: null,
                    charElement: $('<span/>')
                        .text(c)
                        .addClass((isFirst) ? highlightedCSS : typeCSS)
                        .appendTo(controls.pattern),
                    inputElement: $('<span/>')
                        .text((isFirst) ? c : null)
                        .addClass((isFirst) ? highlightedCSS : null)
                        .appendTo(controls.keytrainer),
                };
            });
            callback();
        },
        /**
         * Load tips JSON for selected language
         * @method getTips
         * @param {JSON} data tips JSON
         * @param {function} callback callback function
         */
        getTips(data, callback) {
            tips.tips = data;
            callback();
        },
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
                if (identifier === tipMissprint) controls.tips.addClass(etextCSS);
                else controls.tips.removeClass(etextCSS);
            }
        },
        /**
         * Search key by char or keyCode returned by event object
         * @param {string} char
         * @param {string} keyCode
         * @returns {object} Returns keyboard key object @see {Key}
         */
        findKey(char, keyCode) {
            if (this.keys) {
                return this.keys.filter(
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
