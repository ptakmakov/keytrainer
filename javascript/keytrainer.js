/* eslint-disable import/extensions */
import { backslash, Keyboard } from './keytrainer.keyboard.js';
import Stopwatch from './stopwatch.js';
import { resize, widthRatio } from './resize.js';

let keytrainer;
/**
 * Document elements selectors
 */
const patternSelector = '.keytrainer-pattern';
const keytrainerSelector = '.keytrainer';
const timerSelector = '.timer';
const speedSelector = '.speed';
const missprintsSelector = '.missprints';
const tipsSelector = '.tips';
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

// eslint-disable-next-line no-undef
$(document).ready(
    () => {
        backslash.value = '\\';
        // prod
        // keytrainer = new Keytrainer();
        // dev
        // eslint-disable-next-line no-use-before-define
        window.keytrainer = new Keytrainer();
        keytrainer = window.keytrainer;
        keytrainer.keyboard = new Keyboard();
        keytrainer.keyboard.init(layoutJSON, () => document.dispatchEvent(keyboardready));
        keytrainer.stopwatch = new Stopwatch();
        keytrainer.stopwatch.delay = 5;
        keytrainer.stopwatch.format = 'mm:ss';
        keytrainer.stopwatch.timerElement = keytrainer.timerElement;
        keytrainer.stopwatch.speedElement = keytrainer.speedElement;
        keytrainer.getTips(tipsJSON, () => keytrainer.renderTip());
        keytrainer.getPattern(patternJSON, () => document.dispatchEvent(patternready));
        widthRatio.value = 6.5;
        resize(window.innerWidth);
    },
);

function Keytrainer() {
    const preventDefault = true;
    let missprints = 0;
    let stopwatchStarted = false;
    return {
        // eslint-disable-next-line no-undef
        patternElement: $(patternSelector),
        // eslint-disable-next-line no-undef
        keytrainerElement: $(keytrainerSelector),
        // eslint-disable-next-line no-undef
        timerElement: $(timerSelector),
        // eslint-disable-next-line no-undef
        speedElement: $(speedSelector),
        // eslint-disable-next-line no-undef
        missprintsElement: $(missprintsSelector),
        // eslint-disable-next-line no-undef
        tipsElement: $(tipsSelector),
        keyboard: null,
        stopwatch: null,
        keys: [],
        pattern: [],
        position: 0,
        tips: null,
        startStopwatch() {
            if (!stopwatchStarted) {
                this.stopwatch.reset();
                this.stopwatch.start();
                this.stopwatch.quantity = 0;
                stopwatchStarted = true;
            }
            this.stopwatch.quantity += 1;
        },
        renderCurrentChar(input) {
            const patternItem = this.pattern[this.position];

            patternItem.charElement
                .toggleClass(highlightedCSS)
                .toggleClass(typedCSS);
            if (patternItem.char === ' ') patternItem.charElement.text(' ');

            patternItem.input = input;
            patternItem.inputElement
                .text(input)
                .toggleClass(highlightedCSS);

            if (input !== patternItem.char) {
                patternItem.inputElement.toggleClass(etextCSS);
                missprints += 1;
                this.missprintsElement.html(String(missprints).padStart(2, '0'));
            }
        },
        renderNextChar() {
            const patternItem = this.pattern[this.position];

            if (patternItem.char === ' ') {
                patternItem.inputElement.text('_');
                patternItem.charElement.text('_');
            } else {
                patternItem.inputElement.text(patternItem.char);
            }
            patternItem.inputElement.toggleClass(highlightedCSS);
            patternItem.charElement
                .toggleClass(highlightedCSS)
                .toggleClass(typeCSS);
        },
        keyDown(key, input) {
            if (!key.isDown) {
                if (this.position < this.pattern.length) {
                    this.startStopwatch();
                    if (!key.isSpecial || key.lowercaseKey === 'Space') {
                        this.renderCurrentChar(input);
                        this.position += 1;
                        if (this.position < this.pattern.length) this.renderNextChar();
                        else {
                            this.stopwatch.stop();
                            this.renderTip(tipNewphrase);
                        }
                    }
                } else if (input === ' ') this.getPattern(patternJSON, () => this.renderTip());
                key.toggleKey();
            }
        },
        keyUp(key) {
            if (key.isDown) {
                key.toggleKey();
            }
        },
        freeKeys() {
            this.keys
                .filter((v) => v.isDown)
                .forEach((v) => v.toggleKey());
        },
        /**
         * Tracks events keydown, keypress, keyup
         * Controlls keyboard behavior
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
         * Get JSON from url and create pattern and keytrainer HTML elements
         * @param {String} src URL to JSON whith keyboard layout
         * @param {Function} callback called when ready
         */
        getPattern(src, callback) {
            this.pattern = [];
            this.position = 0;
            this.patternElement.html('');
            this.keytrainerElement.html('');
            this.missprintsElement.html('00');
            this.renderTip();
            missprints = 0;
            this.stopwatch.stop();
            stopwatchStarted = false;
            // eslint-disable-next-line no-undef
            $.getJSON(src, (data) => {
                this.pattern = Array.from(data.pattern).map((c, i) => {
                    const isFirst = i === 0;
                    return {
                        char: c,
                        input: null,
                        // eslint-disable-next-line no-undef
                        charElement: $('<span/>')
                            .text(c)
                            .addClass((isFirst) ? highlightedCSS : typeCSS)
                            .appendTo(this.patternElement),
                        // eslint-disable-next-line no-undef
                        inputElement: $('<span/>')
                            .text((isFirst) ? c : null)
                            .addClass((isFirst) ? highlightedCSS : null)
                            .appendTo(this.keytrainerElement),
                    };
                });
                callback();
            });
        },
        getTips(src, callback) {
            // eslint-disable-next-line no-undef
            $.getJSON(src, (data) => {
                this.tips = data;
                callback();
            });
        },
        renderTip(identifier) {
            if (!this.tips) return;
            this.tipsElement.removeClass(etextCSS);
            if (!identifier) {
                const tips = this.tips[tipRandom];
                this.tipsElement.html(tips[Math.random() * tips.length | 0]);
            }
            if (identifier) this.tipsElement.html(this.tips[identifier]);
            if (identifier === tipMissprint) this.tipsElement.addClass(etextCSS);
        },
        findKey(key, keyCode) {
            return this.keys.filter(
                (k) => ((k.isSpecial)
                    ? k.lowercaseKey === keyCode
                    : k.lowercaseKey === key || k.uppercaseKey === key),
            )[0];
        },
        get preventDefault() { return preventDefault; },
    };
}

document.addEventListener('keyboardready', () => { keytrainer.keys = keytrainer.keyboard.keys; });
document.addEventListener('patternready', () => {
    // eslint-disable-next-line no-undef
    $(window).on('keypress keydown keyup', (e) => { keytrainer.trackKey(e); });
    // eslint-disable-next-line no-undef
    $(window).on('resize', () => resize(window.innerWidth));
    // eslint-disable-next-line no-undef
    $(window).on('blur', () => keytrainer.freeKeys());
});
