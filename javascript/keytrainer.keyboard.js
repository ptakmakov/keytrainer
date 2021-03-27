/**
 * Document elements selectors
 */
const keyboard = ".keyboard";
/**
 * HTML element used for render keyboard
 */
 const divelement = "<div/>";
/**
 * CSS classes, other CSS classes defined in json layout in first element of key array
 */
const keysrow = "keys-row";
const keysrowsdelimiter = "keys-delimiter";
const highlighted = "highlighted";
const keyrow = "key-row";
const keycell = "key-cell";
const keyspecial = "key-special";
const fingerdown = "-d";
const backslashCSS = "Backslash";
const keyCSS = "key";
/**
 * In other than ru or en-us layouts the backslash key can have other than \ value
 * and can be modified by outside script bofore keyboard initialized and rendered
 */
let backslash = function Backslash() {
    return {
        value: "\\"
    }
}();
/**
 * Keyboard object
 * loads and render keyboard from json
 * @object 
 * @returns {Object} Keyboard object
 */
function Keyboard() {
    let _keys = [];
    let _keyboardElement;
    function _Render(rows) {
        rows.forEach(
            function (keys, i, a) {
                let row = KeysRow().appendTo(_keyboardElement);
                keys.forEach(
                    function (k) {
                        let key = Key(k);
                        key.keyElement.appendTo(row);
                        _keys.push(key);
                    }, row, _keys
                );
                if (i + 1 < a.length) Delimiter().appendTo(_keyboardElement);
            }
        );
    }
    return {
        /**
         * Property keys
         * @returns {Array[{Object}...]} Returns array of objects type of Key
         */
        keys: _keys,
        
        /**
         * 
         * @param {string} src URL to json keyboard array[keyboard rows array[keyboard keys array[]]]
         * @param {callback} callback any callback function
         */
        Init: function (src, callback) {
            _keyboardElement = $(keyboard).html("");
            $.getJSON(src, function (data) { _Render(data); callback(); })
        }
    };
}
/**
 * Function Div
 * Creates <div/> with attributes
 * @param {[object]} o Object which represents jQuery HTML element attributes
 * @returns {object} JQuery object <div/> with or without attributes
 */
function jQueryElement(o) {
    return $(divelement, o);
}
/**
 * Keyboard KeysRow
 * @returns {object} jQuery div element with CSS class 'keys-row'
 */
function KeysRow() {
    return jQueryElement({
        class: keysrow
    });
}
/**
 * Delimiter between keyboard keys rows
 * @returns {object} jQuery div element with CSS class 'keys-delimiter'
 */
function Delimiter() {
    return jQueryElement({
        class: keysrowsdelimiter
    });
}
/**
 * Keyboard Key
 * @typedef {object} Key 
 * @param {array} key
 * Array with key information ["Class for finger", "Character | SpecialKeySystemName", "UppercaseCharacter | SpecialKeyTitle"]
 * @method Toogle() Toggles classes between Key up and Key down
 * @method Highlight() Switches Key between highlighted and regular
 * @property {string} character Key lowercase character
 * @property {string} uppercase Key uppercase character
 * @property {string} classCSS CSS class of Key
 * @property {string} fingerCSS CSS class of Key for one of the finger(thumb, index, middle, ring, little)
 * @property {string} fingerDownCSS CSS class of Key for one of the fingers for pressed key
 * @property {boolean} IsBackSlash The BackSlach keyboard key is bigger than other and in case of that used unique CSS class
 * @property {boolean} IsSpecial A SpecialKey flag
 * @property {object} keyElement The jQuery element
 */
function Key(key) {
    if (!Array.isArray(key) && key.length != 3) return null;
    const [fingerCSS, lowercaseKey, uppercaseKey] = key;
    const isSpecial = lowercaseKey.length > 1;
    const isBackSlash = lowercaseKey === backslash.value;
    let classCSS = (isSpecial || isBackSlash) ? lowercaseKey.replace(backslash.value, backslashCSS) : keyCSS;
    classCSS += " " + fingerCSS;
    let keyElement = jQueryElement({ class: classCSS });
    function _Render() {
        if (isSpecial) {
            keyElement.append(KeySpecial(uppercaseKey));
        } else {
            keyElement
                .append(
                    KeyRow().append(KeyCell(uppercaseKey)).append(KeyCell())
                )
                .append(
                    KeyRow().append(KeyCell()).append(KeyCell(lowercaseKey))
                );
        }
    } _Render();
    return {
        Toogle: function () {
            this.keyElement.toggleClass(this.fingerCSS).toggleClass(this.fingerDownCSS);
        },
        Highlight: function () {
            this.keyElement.toggleClass(highlighted);
        },
        character: lowercaseKey,
        uppercase: uppercaseKey,
        class: classCSS,
        fingerCSS: fingerCSS,
        fingerDownCSS: fingerCSS + fingerdown,
        isBackSlash: isBackSlash,
        isSpecial: isSpecial,
        keyElement: keyElement
    };
}
function KeyRow() {
    return jQueryElement({
        class: keyrow
    });
}
function KeyCell(text) {
    return jQueryElement({
        class: keycell,
        text: text
    });
}
function KeySpecial(text) {
    return jQueryElement({
        class: keyspecial,
        text: text
    });
}
export {backslash, Keyboard}