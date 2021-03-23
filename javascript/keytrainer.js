var keytrainer;
var keyboard;
const renderKeyboard = document.createEvent('Event');
renderKeyboard.initEvent('renderkeyboard', true, true);
const loadLayout = document.createEvent('Event');
loadLayout.initEvent('loadlayout', true, true);
document.addEventListener('loadlayout', () => keyboard.Render());
document.addEventListener('renderkeyboard', () => keytrainer.Start());

$(document).ready(
    function () {
        keytrainer = new Keytrainer();
        keyboard = new Keyboard();
        keyboard.Init("/json/en.json");
    }
);
function Keytrainer() {
    return {
        pattern: $(".keytrainer-pattern"),
        keytrainer: $(".keytrainer"),
        timer: $(".timer"),
        speed: $(".speed"),
        keyboard: null,
        Start: function () {
            console.log('started');
        }
    }
}