$(document).ready(function () {
    kt.init();
    $.getJSON("json/layout.json?3", //?" + Math.round(Math.random() * 100)
        function (data) {
            kt.createKeyboard($(".keytrainer-keyboard").html(""), data);
            kt.startKeyTrainer();
        }
    );
    $(window).on("keydown keypress keyup", function (eventObject) {
        kt.keyEventHandler(eventObject);
    });
    $(window).on("blur", function () {
        kt.clearKeys();
    });
    $(window).resize(function () {
        kt.resize(kt.size);
    });
});
var kt = {
    _keyCapsLock: null,
    _preventDefault: { ControlLeft: true, AltLeft: true },
    _pattern: "Text for type and highlighted character",//"Шаблон текста и подсвеченный символ для тренировки слепого набора", //
    _typed: [],
    currentPosition: 0,
    keyCapsLockClass: "CapsLockEnabled",
    pressedKeys: [],
    init: function () {
        this.keytrainer = $(".keytrainer");
        this.keytrainerpattern = $(".keytrainer-pattern");
        this.timer = $(".timer");
        this.mistakes = $(".mistakes");
        this.speed = $(".speed");
        this.resize(this.size);
    },
    startTimer: function () {
        this.timer.text("00:00:00");
        this.time = 0;
        this.interval = window.setInterval(this.tickTimer, 100);
    },
    tickTimer: function () {
        var m, s, mi;
        kt.time++;
        mi = kt.time % 10;
        s = Math.floor((kt.time - mi) / 10);
        m = Math.floor((s-s%60) / 60);
        kt.timer.text(kt.addZero(m) + ":" + kt.addZero(s%60) + ":" + kt.addZero(mi));
    },
    stopTimer: function () {
        window.clearInterval(this.interval);
    },
    resize: function (size) {
        $("body").css("font-size", ((size > 150) ? 150 : size) + "%");
    },
    clearKeys: function () {
        for (var i in this.pressedKeys) {
            this.toggleKey($("#" + this.pressedKeys[i]));
        }
        this.pressedKeys.splice(0, this.pressedKeys.length);
    },
    startKeyTrainer: function () {
        this.createPattern(this.getNewPattern());
        this.createKeyTrainer();
    },
    createKeyTrainer: function (s) {
        var m = 0;
        var html = $("<span>");
        console.log(kt.time*1000+" "+this.position);
        if (this.position === 1) this.startTimer();
        this.typed = s;
        if (this.position >= 1)
            this.lightKey(this.pattern[this.position - 1]);
        for (var i in this.typed) {
            if (this.typed[i] === this.pattern[i]) html.html(html.html() + this.typed[i]);
            if (this.typed[i] !== this.pattern[i]) {
                $("<span>", {
                    class: "e-text-c",
                    text: (this.typed[i] === " ") ? "_" : this.typed[i]
                }).appendTo(html);
                m++;
            }
        }
        if (this.typed.length < this.pattern.length)
            $("<span>", {
                class: "highlighted",
                text: this.highlightSpace(this.pattern[this.typed.length])
            }).appendTo(html);
        if (m > 0) this.mistakes.text(this.addZero(m));
        this.keytrainer.html(html.html());
    },
    get typed() { return this._typed; },
    set typed(s) {
        (s) ? this._typed.push(s) : this._typed.splice(0, this._typed.length);
    },
    createPattern: function (pattern) {
        this.keytrainerpattern.html(this.getPatternHTML(pattern));
    },
    getPatternHTML: function (pattern) {
        if (!Array.isArray(pattern)) return "Invalid pattern";
        var typed = $("<span>", { class: "typed" }),
            highlighted = $("<span>", { class: "highlighted" }),
            type = $("<span>", { class: "type" });
        for (var i in pattern) {
            if (i < this.position) typed.text(typed.text() + pattern[i]);
            if (i == this.position) {
                highlighted.text(highlighted.text() + this.highlightSpace(pattern[i]));
                this.lightKey(pattern[i]);
            }
            if (i > this.position) type.text(type.text() + pattern[i]);
        }
        return typed.prop("outerHTML") + highlighted.prop("outerHTML") + type.prop("outerHTML");
    },
    highlightSpace: function (s) { return (s === " ") ? "_" : s; },
    lightKey: function (s) {
        this.getKeyButton(this.getKey(this.getKeyId(s, s))).toggleClass("highlighted");
    },
    keyEventHandler: function (e) {
        if (this.preventDefault)
            e.preventDefault();
        var keyId = this.getKeyId(e.key, e.code),
            key = this.getKey(keyId);
        if (!key.prop("tagName")) $(".tips").prop("innerText", "Missed key. Try to change keyboard layout").addClass("e-text-c");
        else $(".tips.e-text-c").prop("innerText", this.getTip()).removeClass("e-text-c");
        if (e.type === "keydown" && $.inArray(keyId, this.pressedKeys) === -1) {
            this.pressedKeys.push(keyId);
            this.toggleKey(key);
            this.preventDefault = this.pressedKeys;
            if (key.length && (!key.hasClass("key-special") || this.isSpecial(keyId))) {
                this.position++;
                if (this.position === this.pattern.length) {
                    this.createKeyTrainer(e.key);
                    this.stopTimer();
                    this.lightKey(" ");
                } else if (this.position > this.pattern.length) {
                    this.lightKey(" ");
                    this.createPattern(this.getNewPattern());
                    this.createKeyTrainer();
                } else {
                    this.createKeyTrainer(e.key);
                    this.createPattern(this.pattern);
                }
            }
        }
        if (e.type === "keyup") {
            if (this.keyCapsLock)
                this.detectCapsLockState(e.originalEvent.getModifierState("CapsLock"), e.key === "CapsLock");
            if (
                this.pressedKeys.length > 0 &&
                (
                    $.inArray("AltLeft", this.pressedKeys) === this.pressedKeys.length - 1 ||
                    $.inArray("AltRight", this.pressedKeys) === this.pressedKeys.length - 1
                )
            )
                this.clearKeys();
            else if ($.inArray(keyId, this.pressedKeys) !== -1) {
                this.toggleKey(key);
                this.pressedKeys.splice($.inArray(keyId, this.pressedKeys), 1);
            }
        }
    },
    getKey: function (keyId) {
        return $("#" + keyId);
    },
    getKeyId: function (eKey, eCode) {
        if (eKey === " ") {
            eKey = "Space";
            eCode = "Space";
        }
        return ((eKey.length > 1 || this.isSpecial(eCode)) ? eCode : eKey.toLowerCase().charCodeAt(0));
    },
    getKeyButton: function (element) {
        return (element.parents(".key").length > 0) ?
            element.parents(".key") :
            (
                (element.parents(".Backslash").length > 0) ? element.parents(".Backslash") : element.parents("." + element.attr("id"))
            );
    },
    toggleKey: function (element) {
        var key = this.getKeyButton(element);
        var keyClasses = (key.attr("class")) ? key.attr("class").split(" ") : [];
        for (var keyClass of keyClasses)
            switch (keyClass.toLowerCase()) {
                case "if-d":
                case "if":
                    key.toggleClass("if").toggleClass("if-d");
                    break;
                case "mf-d":
                case "mf":
                    key.toggleClass("mf").toggleClass("mf-d");
                    break;
                case "rf-d":
                case "rf":
                    key.toggleClass("rf").toggleClass("rf-d");
                    break;
                case "lf-d":
                case "lf":
                    key.toggleClass("lf").toggleClass("lf-d");
                    break;
                case "tf-d":
                case "tf":
                    key.toggleClass("tf").toggleClass("tf-d");
                    break;
            }
    },
    createKeyboard: function (element, layout) {
        var el;
        for (var i in layout) {
            var isObect = typeof (layout[i]) === "object";
            if (!Array.isArray(layout[i]) && isObect) {
                el = this.createElement(layout[i]).appendTo(element);
            }
            if (isObect)
                this.createKeyboard((el) ? el : element, layout[i]);
        }
    },
    createElement: function (o) {
        var element = $("<div/>");
        for (var i in o) {
            if (Array.isArray(o[i])) continue;
            if (i === "text") element.text(o[i]);
            else if (i === "id") (o[i].length > 1) ? element.attr(i, o[i]) : element.attr(i, o[i].charCodeAt(0));
            else element.attr(i, o[i]);
        }
        return element;
    },
    get preventDefault() { return this._preventDefault.ControlLeft && this._preventDefault.AltLeft; },
    set preventDefault(a) {
        if (!this.compareArrays(a, Object.keys(this._preventDefault))) return;
        for (var i of a) {
            if (this._preventDefault[i] === undefined) return;
        }
        for (var i in this._preventDefault) {
            this._preventDefault[i] = !this._preventDefault[i];
        }
    },
    compareArrays: function (a, b) {
        if (a.length !== b.length) return false;
        for (var i = 0, l = a.length; i < l; i++) {
            if (Array.isArray(a[i]) && Array.isArray(b[i])) {
                if (!this.compareArrays(a[i], b[i])) return false;
            } else if (a[i] !== b[i]) return false;
        }
        return true;
    },
    get keyCapsLock() {
        if (!this._keyCapsLock) this.keyCapsLock = $(".CapsLock");
        return this._keyCapsLock;
    },
    set keyCapsLock(o) { this._keyCapsLock = o; },
    detectCapsLockState: function (IsEnabled, IsCapsLock) {
        if (IsCapsLock)
            this.toggleCapsLock();
        else
            (IsEnabled) ? this.enableCapsLock() : this.disableCapsLock();
    },
    toggleCapsLock: function () { this.keyCapsLock.toggleClass(this.keyCapsLockClass); },
    enableCapsLock: function () { this.keyCapsLock.addClass(this.keyCapsLockClass); },
    disableCapsLock: function () { this.keyCapsLock.removeClass(this.keyCapsLockClass); },
    get pattern() { return this._pattern.split(""); },
    set pattern(s) { this._pattern = s; },
    getNewPattern: function () {
        this.resetPosition();
        return this.pattern;
    },
    get position() { return (this.currentPosition) ? this.currentPosition : 0; },
    set position(i) {
        this.currentPosition = i;
    },
    resetPosition: function () { this.currentPosition = 0; },
    get size() { return Math.round($(window).width() / 8); },
    isSpecial: function (s) { return ($.inArray(s, ["Space"]) !== -1) },
    getTip: function () { return "Some tip for you"; },
    addZero: function (s) { return ((s < 10) ? "0" : "") + s; }
};