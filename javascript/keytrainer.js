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
/**
 * CSS classes, other CSS classes defined in json layout in first element of key array
 */
const highlightedCSS = 'highlighted';
const typeCSS = 'type';
/**
* Default URLs
*/
const layoutJSON = '/json/en.json';
const patternJSON = '/node/pattern.js';
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
        // keytrainer = Keytrainer();
        // dev
        // eslint-disable-next-line no-use-before-define
        window.keytrainer = new Keytrainer();
        keytrainer = window.keytrainer;
        keytrainer.keyboard = new Keyboard();
        keytrainer.keyboard.init(layoutJSON, () => document.dispatchEvent(keyboardready));
        keytrainer.getPattern(patternJSON, () => document.dispatchEvent(patternready));
        keytrainer.stopwatch = new Stopwatch();
        keytrainer.stopwatch.delay = 5;
        keytrainer.stopwatch.format = 'mm:ss';
        keytrainer.stopwatch.timerElement = keytrainer.timerElement;
        keytrainer.stopwatch.speedElement = keytrainer.speedElement;
        widthRatio.value = 6.5;
        resize(window.innerWidth);
    },
);

function Keytrainer() {
    const preventDefault = true;
    return {
        // eslint-disable-next-line no-undef
        patternElement: $(patternSelector),
        // eslint-disable-next-line no-undef
        keytrainerElement: $(keytrainerSelector),
        // eslint-disable-next-line no-undef
        timerElement: $(timerSelector),
        // eslint-disable-next-line no-undef
        speedElement: $(speedSelector),
        keyboard: null,
        stopwatch: null,
        keys: [],
        pattern: [],
        position: 0,
        keyDown(key) {
            if (!key.isDown) {
                key.Toggle();
            }
        },
        keyUp(key) {
            if (key.isDown) {
                key.Toggle();
            }
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
            switch (e.type) {
            case 'keydown': this.keyDown(key);
                break;
            case 'keyup': this.keyUp(key);
                break;
            default:
                break;
            }
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
});
