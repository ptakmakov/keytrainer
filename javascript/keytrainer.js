import {backslash, Keyboard} from './keytrainer.keyboard.js'
const pattern = $(".keytrainer-pattern");
const keytrainer = $(".keytrainer");
const timer =$(".timer");
const speed = $(".speed")
let ktrainer;

/**
 * keyboardready event
 * @event keyboardready
 * @fires keytrainer.Start()
 */
const keyboardready = document.createEvent('Event');
keyboardready.initEvent('keyboardready', true, true);
document.addEventListener('keyboardready', () => ktrainer.Start());

$(document).ready(
    function () {
        backslash.value = "\\";
        ktrainer = Keytrainer();
        ktrainer.keyboard = Keyboard();
        ktrainer.keyboard.Init("/json/en.json", function(){document.dispatchEvent(keyboardready);});
    }
);
function Keytrainer() {
    return {
        pattern: pattern,
        keytrainer: keytrainer,
        timer: timer,
        speed: speed,
        keyboard: null,
        keys: null,
        Start: function () {
            this.keys = this.keyboard.keys;
            console.log('started');
        }
    }
}