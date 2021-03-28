import { backslash, Keyboard } from './keytrainer.keyboard.js'
import { Stopwatch } from './stopwatch.js'
/**
 * Document elements selectors
 */
const patternSelector = ".keytrainer-pattern";
const keytrainerSelector = ".keytrainer";
const timerSelector = ".timer";
const speedSelector = ".speed";

let keytrainer;

/**
 * keyboardready event
 * @event keyboardready
 * @fires Keytrainer.Start()
 */
const keyboardready = document.createEvent("Event");
keyboardready.initEvent("keyboardready", true, true);
document.addEventListener("keyboardready", () => keytrainer.keys = keytrainer.keyboard.keys);
/**
 * patternready event
 * @event patternready
 * @fires Keytrainer.Init
 */
const patternready = document.createEvent("Event");
patternready.initEvent("patternready", true, true);
document.addEventListener("patternready", () => keytrainer.RenderPattern());

$(document).ready(
    () => {
        backslash.value = "\\";
        //keytrainer = Keytrainer();
        //dev
        keytrainer = window.keytrainer = Keytrainer();
        keytrainer.keyboard = Keyboard();
        keytrainer.keyboard.Init("/json/en.json", () => document.dispatchEvent(keyboardready));
        keytrainer.GetPattern("/node/pattern.js", () => document.dispatchEvent(patternready));
        keytrainer.stopwatch = Stopwatch();
        keytrainer.stopwatch.delay = 5;
        keytrainer.stopwatch.format = "mm:ss";
        keytrainer.stopwatch.element = keytrainer.timerElement;
    }
);
function Keytrainer() {
    return {
        patternElement: $(patternSelector),
        keytrainerElement: $(keytrainerSelector),
        timerElement: $(timerSelector),
        speedElement: $(speedSelector),
        keyboard: null,
        stopwatch: null,
        keys: null,
        pattern: [],
        position: 0,
        RenderPattern: function () {
            
        },
        GetPattern: function (src, callback) {
            this.pattern = [];
            this.position = 0;
            this.patternElement.html("");
            this.keytrainerElement.html("");
            $.getJSON(src, (data) => {
                Array.from(data.pattern).forEach((c, i) => {
                    const isFirst = i==0;
                    this.pattern.push(
                        { 
                            char: c, 
                            input: null, 
                            isMissed: false, 
                            charElement: $("<span/>")
                                .text(c)
                                .addClass((isFirst)?"highlighted":"type")
                                .appendTo(this.patternElement), 
                            inputElement: $("<span/>")
                                .text((isFirst)?c:null)
                                .addClass((isFirst)?"highlighted":null)
                                .appendTo(this.keytrainerElement)
                        });
                });
                callback();
            })
        }
    }
}