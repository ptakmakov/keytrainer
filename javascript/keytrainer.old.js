$(document).ready(function() {
    kt.init();
});
var kt = {
    init: function() {
        this.resetTypePosition();
        this.currentPattern = this.getPattern();
        this.keyTrainerPattern = $(".keytrainer-pattern");
        this.keyTrainer = $(".keytrainer");
        $.getJSON("json/defaultlayout.json?" + Math.round(Math.random() * 100),
            function(data) {
                kt.drawKeyboardRows($(".keytrainer-keyboard").html(""), data);
            }
        );
        $(window).on("keydown keypress keyup", function(eventObject) {
            kt.keyTracker(eventObject);
        });
    },
    keyTracker: function(e) {
        if (e.type == "keydown") {
            console.log(e.key.length, "#" + ((e.key.length > 1) ? e.code : "key" + e.key.charCodeAt(0)));
            this.toogleKey($("#" + ((e.key.length > 1) ? e.code : "key" + e.key.charCodeAt(0))));
        }
        if (e.type == "keypress") {
            this.position++;
            if (this.position == this.currentPattern.length) this.currentPattern = this.getPattern();
        }
        //console.log(e.key, e.keyCode, String.fromCharCode(e.key.charCodeAt(0)), e.key.charCodeAt(0), event.location, e.code);

        if (e.type == "keyup") {
            if (this.keyCapsLock)
                this.detectCapsLockState(e.originalEvent.getModifierState("CapsLock"), e.key == "CapsLock");
            //else this.keyCapsLock = $(".capslock");
            this.toogleKey($("#" + ((e.key.length > 1) ? e.code : "key" + e.key.charCodeAt(0))));
            //console.log(this.keyCapsLock);
        }

    },
    detectCapsLockState: function(IsEnabled, IsCapsLock) {
        if (IsCapsLock)
            this.toggleCapsLock();
        else
            (IsEnabled) ? this.enableCapsLock() : this.disableCapsLock();
    },
    getPattern: function() {
        return this.pattern;
    },
    toogleKey: function(key) {
        console.log(key);
        (
            (key.parents(".key").length > 0) ? key.parents(".key") : key.parents("." + key.attr("id"))
        ).toggleClass("dark-primary-color").toggleClass("default-primary-color");

    },
    drawKeyboardRows: function(keyBoard, keyRows) {
        for (var rows in keyRows) {
            this.drawKeyboardRow(keyBoard, keyRows[rows]);
        }
    },
    drawKeyboardRow: function(keyBoard, keyRows) {
        for (var row in keyRows) {
            this.drawKeyboardRowKeys(this.div({ class: "keys-row" }).appendTo(keyBoard), keyRows[row]);
            this.div({ class: "keys-delemiter" }).appendTo(keyBoard);
        }
    },
    drawKeyboardRowKeys: function(keysRow, row) {
        for (var keys in row) {
            this.drawKeyboardRowKey(keysRow, row[keys]);
        }
    },
    drawKeyboardRowKey: function(keysRow, Keys) {
        for (var key in Keys) {
            this.drawKey(keysRow, Keys[key]);
        }
    },
    drawKey: function(keysRow, Key) {
        this.drawKeyRows(
            this.div({ class: this.keyClass(Key.keyclass) }).appendTo(keysRow),
            Key.keyclass,
            Key.keyprimary,
            Key.keysecondary
        );
    },
    drawKeyRows: function(key, keyClass, keyPrimary, keySecondary) {
        if (!keyClass || keyClass == "Overenter") {
            this.drawKeyRow(
                this.div({ class: "key-row" }).appendTo(key), [
                    this.div({ class: "key-secondary", text: keySecondary, id: "key" + keySecondary.charCodeAt(0) }),
                    this.keyEmpty()
                ]);
            this.drawKeyRow(
                this.div({ class: "key-row" }).appendTo(key), [
                    this.keyEmpty(),
                    this.div({ class: "key-primary", text: keyPrimary, id: "key" + keyPrimary.charCodeAt(0) })
                ]);
        } else {
            this.drawKeyRow(
                this.div({ class: "key-row" }).appendTo(key), [
                    this.div({ class: "key-special", text: keyPrimary, id: keyClass })
                ]);
        }
        key.addClass("default-primary-color");

        if (keyClass == "CapsLock") this.keyCapsLock = key;
    },
    drawKeyRow: function(keyRow, cells) {
        for (var i in cells)
            cells[i].appendTo(keyRow);
    },
    keyClass: function(keyclass) { return ((keyclass) ? keyclass : "key"); },
    keyEmpty: function() { return this.div({ class: "key-empty" }); },
    div: function() {
        var x = $("<div>");
        if (!arguments) return x;
        var a = arguments[0];
        for (var i in a) {
            (i == "text") ? x.text(a[i]): x.attr(i, a[i]);
        }
        return x;
    },
    _keyCapsLock: null,
    get keyCapsLock() {
        if (!this._keyCapsLock) this.keyCapsLock = $(".capslock");
        return this._keyCapsLock;
    },
    set keyCapsLock(o) { this._keyCapsLock = o; },
    keyCapsLockClass: "CapsLockEnabled",
    toggleCapsLock: function() { this.keyCapsLock.toggleClass(this.keyCapsLockClass); },
    enableCapsLock: function() { this.keyCapsLock.addClass(this.keyCapsLockClass); },
    disableCapsLock: function() { this.keyCapsLock.removeClass(this.keyCapsLockClass); },
    pattern: "Text for type and highlighted character",
    currentPosition: 0,
    get position() {
        return this.currentPosition;
    },
    set position(i) {
        this.currentPosition = i;
    },
    resetTypePosition: function() {
        this.currentPosition = 0;
    }
};