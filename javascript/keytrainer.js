import { backslash, Keyboard } from './keytrainer.keyboard.js'
import { Stopwatch } from './stopwatch.js'
const pattern = ".keytrainer-pattern";
const keytrainerInput = ".keytrainer";
const timer = ".timer";
const speed = ".speed";

let keytrainer;

/**
 * keyboardready event
 * @event keyboardready
 * @fires keytrainer.Start()
 */
const keyboardready = document.createEvent('Event');
keyboardready.initEvent('keyboardready', true, true);
document.addEventListener('keyboardready', () => keytrainer.Start());

$(document).ready(
    function () {
        backslash.value = "\\";
        //keytrainer = Keytrainer();
        //dev
        keytrainer = window.keytrainer = Keytrainer();
        keytrainer.keyboard = Keyboard();
        keytrainer.keyboard.Init("/json/en.json", function () { document.dispatchEvent(keyboardready); });
        keytrainer.stopwatch = Stopwatch();
    }
);
function Keytrainer() {
    return {
        pattern: $(pattern),
        keytrainer: $(keytrainerInput),
        timer: $(timer),
        speed: $(speed),
        keyboard: null,
        stopwatch: null,
        keys: null,
        Start: function () {
            this.keys = this.keyboard.keys;
            console.log('started');
        }
    }
}