import { backslash, Keyboard } from "./keytrainer.keyboard.js";
import { Stopwatch } from "./stopwatch.js";
import { Resize, widthRatio } from "./resize.js"
let keytrainer;
/**
 * Document elements selectors
 */
const patternSelector = ".keytrainer-pattern";
const keytrainerSelector = ".keytrainer";
const timerSelector = ".timer";
const speedSelector = ".speed";
/**
 * CSS classes, other CSS classes defined in json layout in first element of key array
 */
const highlightedCSS = "highlighted";
const typeCSS = "type";
/**
* Default URLs
*/
const layoutJSON = "/json/en.json";
const patternJSON = "/node/pattern.js";
/**
 * keyboardready event
 * @event keyboardready
 * @fires () assign keyboard.keys to keyitrainer.keys
 */
const keyboardready = document.createEvent("Event");
keyboardready.initEvent("keyboardready", true, true);
document.addEventListener("keyboardready", () => keytrainer.keys = keytrainer.keyboard.keys);
/**
 * patternready event
 * @event patternready
 * @fires Keytrainer.TrackKey(e)
 */
const patternready = document.createEvent("Event");
patternready.initEvent("patternready", true, true);
document.addEventListener("patternready", () => {
    $(window).on("keypress keydown keyup", (e) => { keytrainer.TrackKey(e); });
    $(window).on("resize", () => Resize(window.innerWidth));
}
);

$(document).ready(
    () => {
        backslash.value = "\\";
        //prod 
        //keytrainer = Keytrainer();
        //dev
        keytrainer = window.keytrainer = Keytrainer();
        keytrainer.keyboard = Keyboard();
        keytrainer.keyboard.Init(layoutJSON, () => document.dispatchEvent(keyboardready));
        keytrainer.GetPattern(patternJSON, () => document.dispatchEvent(patternready));
        keytrainer.stopwatch = Stopwatch();
        keytrainer.stopwatch.delay = 5;
        keytrainer.stopwatch.format = "mm:ss";
        keytrainer.stopwatch.timerElement = keytrainer.timerElement;
        keytrainer.stopwatch.speedElement = keytrainer.speedElement;
        widthRatio.value = 6.5;
        Resize(window.innerWidth);
    }
);

function Keytrainer() {
    let _preventDefault = true;
    return {
        patternElement: $(patternSelector),
        keytrainerElement: $(keytrainerSelector),
        timerElement: $(timerSelector),
        speedElement: $(speedSelector),
        keyboard: null,
        stopwatch: null,
        keys: [],
        pattern: [],
        position: 0,
        KeyDown: function (key) {
            if (!key.isDown) {
                key.Toggle();
            }
        },
        KeyUp: function (key) {
            if (key.isDown) {
                key.Toggle();
            }
        },
        /**
         * Tracks events keydown, keypress, keyup
         * Controlls keyboard behavior
         * @param {Event} e keyboard event
         */
        TrackKey: function (e) {
            if (this.preventDefault) e.preventDefault();
            let key = this.FindKey(e.key, e.code);
            if (!key) return;
            switch (e.type) {
                case "keydown": this.KeyDown(key);
                    break;
                case "keyup": this.KeyUp(key);
                    break;
            }
        },
        /**
         * Get JSON from url and create pattern and keytrainer HTML elements
         * @param {String} src URL to JSON whith keyboard layout
         * @param {Function} callback called when ready
         */
        GetPattern: function (src, callback) {
            this.pattern = [];
            this.position = 0;
            this.patternElement.html("");
            this.keytrainerElement.html("");
            $.getJSON(src, (data) => {
                Array.from(data.pattern).forEach((c, i) => {
                    const isFirst = i === 0;
                    this.pattern.push(
                        {
                            char: c,
                            input: null,
                            charElement: $("<span/>")
                                .text(c)
                                .addClass((isFirst) ? highlightedCSS : typeCSS)
                                .appendTo(this.patternElement),
                            inputElement: $("<span/>")
                                .text((isFirst) ? c : null)
                                .addClass((isFirst) ? highlightedCSS : null)
                                .appendTo(this.keytrainerElement)
                        });
                });
                callback();
            })
        },
        FindKey: function (key, keyCode) {
            return this.keys.filter(
                (k) => {
                    return (k.isSpecial) ?
                        k.lowercaseKey === keyCode :
                        k.lowercaseKey === key || k.uppercaseKey === key;
                })[0];
        },
        get preventDefault() { return _preventDefault; }
    }
}