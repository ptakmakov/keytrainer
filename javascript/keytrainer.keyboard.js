function Keyboard() {
    var _keys = [];
    var _keyboardElement;
    function _Render(rows) {
        rows.forEach(
            function (r, i, a) {
                _RenderKeyboardRow(r, new KeysRow().appendTo(_keyboardElement));
                if (i + 1 < a.length) new Delimiter().appendTo(_keyboardElement);
            }
        );
    }
    function _RenderKeyboardRow(keys, row) {
        keys.forEach(
            function(k){
                var key = new Key(k);
                if(key){
                    key.keyElement.appendTo(row);
                    _RenderKeyRows(key);
                }
            }
        );
    }
    function _RenderKeyRows(key) {
        _keys.push(key);
        if (key.isSpecial) {
            _RenderKeySpecial(
                new KeyRow().appendTo(key.keyElement),
                key.secondary
            );
        }
        else {
            _RenderKeyCells(
                new KeyRow().appendTo(key.keyElement),
                new KeyRow().appendTo(key.keyElement),
                key.primary,
                key.secondary
            );
        }
    }
    function _RenderKeySpecial(row, key) {
        new KeySpecial(key).appendTo(row);
    }
    function _RenderKeyCells(toprow, bottomrow, primary, secondary) {
        new KeyCell(secondary).appendTo(toprow);
        new KeyCell().appendTo(toprow);
        new KeyCell().appendTo(bottomrow);
        new KeyCell(primary).appendTo(bottomrow);
    }
    return {
        keys: _keys,
        Init: function (src, callback) {
            _keyboardElement = $(".keyboard").html("");
            $.getJSON(src, function (data) { _Render(data); callback(); })
        }
    };
}
/**
 * Function Div
 * Creates <div/> with attributes
 * @param {object} o New object attributes
 * @returns JQuery object <div/>
 */
function Div(o) {
    return $("<div/>", o);
}
/**
 * 
 * @returns 
 */
function KeysRow() {
    return new Div({
        class: "keys-row"
    });
}
function Delimiter() {
    return new Div({
        class: "keys-delemiter"
    });
}
function Key(key) {
    if (!Array.isArray(key) && key.length != 3) return null;
    var isSpecial = key[1].length > 1;
    var isBackSlash = key[1] == "\\";
    var keyPrimary = key[1];
    var keySecondary = key[2];
    var keyFinger = key[0];
    var style = (isSpecial || isBackSlash) ? keyPrimary.replace("\\", "Backslash") : "key";
    style += " " + keyFinger;
    return {
        class: style,
        isBackSlash: isBackSlash,
        isPressed: false,
        isSpecial: isSpecial,
        keyElement: new Div({ class: style }),
        primary: keyPrimary,
        secondary: keySecondary
    };
}
function KeyRow() {
    return new Div({
        class: "key-row"
    });
}
function KeyCell(text) {
    return new Div({
        class: "key-cell",
        text: text
    });
}
function KeySpecial(text) {
    return new Div({
        class: "key-special",
        text: text
    });
}