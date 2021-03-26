var keytrainer;

const renderKeyboard = document.createEvent('Event');
renderKeyboard.initEvent('renderkeyboard', true, true);
document.addEventListener('renderkeyboard', () => keytrainer.Start());

$(document).ready(
    function () {
        keytrainer = new Keytrainer();
        keytrainer.keyboard = new Keyboard();
        //keyboard = new Keyboard();
        keytrainer.keyboard.Init("/json/en.json", function(){document.dispatchEvent(renderKeyboard);});
    }
);
function Keytrainer() {
    return {
        pattern: $(".keytrainer-pattern"),
        keytrainer: $(".keytrainer"),
        timer: $(".timer"),
        speed: $(".speed"),
        keyboard: null,
        keys: null,
        Start: function () {
            this.keys = this.keyboard.keys;
            console.log('started');
        }
    }
}