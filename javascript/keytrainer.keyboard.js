/* eslint-disable no-undef */
/**
 * HTML element used for render keyboard
 */
const divElement = '<div/>';
/**
 * CSS classes, other CSS classes defined in json layout in first element of key array
 */
const keysrowCSS = 'keys-row';
const keysrowsDelimiterCSS = 'keys-delimiter';
const highlightedCSS = 'highlighted';
const keyrowCSS = 'key-row';
const keycellCSS = 'key-cell';
const keyspecialCSS = 'key-special';
const fingerdownCSS = '-d';
const backslashCSS = 'Backslash';
const keyCSS = 'key';
/**
 * In other than ru or en-us layouts the backslash key can have other than \ value
 * and can be modified by outside script before keyboard initialized and rendered
 */
const backslash = (function Backslash() {
    return {
        value: '\\',
    };
}());
/**
 * Function Div
 * Creates <div/> with attributes
 * @param {[object]} o Object which represents jQuery HTML element attributes
 * @returns {object} JQuery object <div/> with or without attributes
 */
function jQueryElement(o) {
    return $(divElement, o);
}
/**
 * Keyboard KeysRow
 * @returns {object} jQuery div element with CSS class 'keys-row'
 */
function keysRow() {
    return jQueryElement({
        class: keysrowCSS,
    });
}
/**
 * Delimiter between keyboard keys rows
 * @returns {object} jQuery div element with CSS class 'keys-delimiter'
 */
function delimiter() {
    return jQueryElement({
        class: keysrowsDelimiterCSS,
    });
}
function keyRow() {
    return jQueryElement({
        class: keyrowCSS,
    });
}
function keyCell(text) {
    return jQueryElement({
        class: keycellCSS,
        text,
    });
}
function keySpecial(text) {
    return jQueryElement({
        class: keyspecialCSS,
        text,
    });
}
/**
 * Keyboard Key
 * @typedef {object} Key
 * @param {array} key
 * Array with key information
 * ["Class for finger", "Character | SpecialKeySystemName", "UppercaseCharacter | SpecialKeyTitle"]
 * @method Toogle() Toggles classes between Key up and Key down
 * @method Highlight() Switches Key between highlighted and regular
 * @property {string} lowercaseKey Key lowercase character
 * @property {string} uppercaseKey Key uppercase character
 * @property {string} classCSS CSS class of Key
 * @property {string} fingerCSS CSS class of Key for one of the finger
 * (thumb, index, middle, ring, little)
 * @property {string} fingerDownCSS CSS class of Key for one of the fingers for pressed key
 * @property {boolean} IsBackSlash The BackSlach keyboard key is bigger than other
 * and in case of that used unique CSS class
 * @property {boolean} IsSpecial A SpecialKey flag
 * @property {object} keyElement The jQuery element
 */
function Key(key) {
    if (!Array.isArray(key) && key.length !== 3) return null;
    const [fingerCSS, lowercaseKey, uppercaseKey] = key;
    const isSpecial = lowercaseKey.length > 1;
    const isBackSlash = lowercaseKey === backslash.value;
    let classCSS = (isSpecial || isBackSlash)
        ? lowercaseKey.replace(backslash.value, backslashCSS)
        : keyCSS;
    classCSS += ` ${fingerCSS}`;
    const keyElement = jQueryElement({ class: classCSS });
    function render() {
        if (isSpecial) {
            keyElement.append(keySpecial(uppercaseKey));
        } else {
            keyElement
                .append(
                    keyRow()
                        .append(keyCell(uppercaseKey))
                        .append(keyCell()),
                )
                .append(
                    keyRow()
                        .append(keyCell())
                        .append(keyCell(lowercaseKey)),
                );
        }
    } render();
    return {
        toggleKey() {
            this.keyElement.toggleClass(this.fingerCSS).toggleClass(this.fingerDownCSS);
            this.isDown = !this.isDown;
        },
        highlightKey() {
            this.keyElement.toggleClass(highlightedCSS);
        },
        lowercaseKey,
        uppercaseKey,
        class: classCSS,
        fingerCSS,
        fingerDownCSS: fingerCSS + fingerdownCSS,
        isBackSlash,
        isSpecial,
        keyElement,
        isDown: false,
    };
}
/**
 * Keyboard object
 * loads and render keyboard from json
 * @typedef Keyboard
 * @returns {Object} Keyboard object
 * @method Init() get json, start render
 * @param {string} src json url
 * @param {function} callback function called after render completed
 * @property {array} keys array of Key objects @see Key
 */
function Keyboard() {
    const keyObjects = [];
    let $keyboardElement;
    function render(rows) {
        rows.forEach(
            (keys, i, a) => {
                const row = keysRow().appendTo($keyboardElement);
                keys.forEach(
                    (k) => {
                        const key = new Key(k);
                        key.keyElement.appendTo(row);
                        keyObjects.push(key);
                    }, row, keyObjects,
                );
                if (i + 1 < a.length) delimiter().appendTo($keyboardElement);
            },
        );
    }
    return {
        /**
         * @property {object} keyboardElement jQuery object
         * @param {object} value jQuery object
         */
        set keyboardElement(value) { $keyboardElement = value; },
        get keyboardElement() { return $keyboardElement; },
        /**
         * Property keys
         * @returns {Array[{Object}...]} Returns array of objects type of Key
         */
        keys: keyObjects,
        /**
         *
         * @param {string} data JSON keyboard array[keyboard rows array[keyboard keys array[]]]
         * @param {callback} callback any callback function
         */
        init(data, callback) {
            this.keyboardElement.html('');
            render(data);
            callback();
        },
    };
}
export { backslash, Keyboard };
