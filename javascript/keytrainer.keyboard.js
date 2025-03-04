/* eslint-disable import/extensions */
import * as css from './keytrainer.css.js';
/* eslint-disable no-undef */
/**
 * HTML element used for render keyboard
 */

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
function createElement(tagName, o) {
    const element = document.createElement(tagName);
    if (o.class) {
        element.className = o.class;
    }
    if (o.text) {
        element.textContent = o.text;
    }
    return element;
}
/**
 * Keyboard KeysRow
 * @returns {object} jQuery div element with CSS class 'keys-row'
 */
function keysRow() {
    return createElement('div', {
        class: css.keysrow,
    });
}
/**
 * Delimiter between keyboard keys rows
 * @returns {object} jQuery div element with CSS class 'keys-delimiter'
 */
function delimiter() {
    return createElement('div', {
        class: css.delimiter,
    });
}
function keyRow() {
    return createElement('div', {
        class: css.keyrow,
    });
}
function keyCell(text) {
    return createElement('div', {
        class: css.keycell,
        text,
    });
}
function keySpecial(text) {
    return createElement('div', {
        class: css.keyspecial,
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
    if (!Array.isArray(key) && key.length !== 3) throw new Error('Invalid key data');
    const [fingerCSS, lowercaseKey, uppercaseKey] = key;
    const isSpecial = lowercaseKey.length > 1;
    const isBackSlash = lowercaseKey === backslash.value;
    let classCSS = (isSpecial || isBackSlash)
        ? lowercaseKey.replace(backslash.value, css.backslash)
        : css.key;
    classCSS += ` ${fingerCSS}`;
    const keyElement = createElement('div', { class: classCSS });
    function render() {
        if (isSpecial) {
            keyElement.appendChild(keySpecial(uppercaseKey));
        } else {
            const topRow = keyRow();
            const bottomRow = keyRow();
            topRow.appendChild(keyCell(uppercaseKey));
            topRow.appendChild(keyCell(''));
            keyElement.appendChild(topRow);
            bottomRow.appendChild(keyCell(''));
            bottomRow.appendChild(keyCell(lowercaseKey));
            keyElement.appendChild(bottomRow);
        }
    } render();
    return {
        toggleKey() {
            this.fingerCSS.split(' ').forEach((className) => {
                if (className) this.keyElement.classList.toggle(className);
            });
            this.fingerDownCSS.split(' ').forEach((className) => {
                if (className) this.keyElement.classList.toggle(className);
            });
            this.isDown = !this.isDown;
        },
        highlightKey() {
            this.keyElement.classList.toggle(css.highlighted);
        },
        lowercaseKey,
        uppercaseKey,
        class: classCSS,
        fingerCSS,
        fingerDownCSS: fingerCSS + css.fingerdown,
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
    let keys = [];
    let keyboardElement;
    function render(rows) {
        rows.forEach(
            (rowkeys, i, a) => {
                const row = keysRow();
                keyboardElement.appendChild(row);
                rowkeys.forEach(
                    (k) => {
                        const key = new Key(k);
                        row.appendChild(key.keyElement);
                        keys.push(key);
                    }, row, keys,
                );
                if (i + 1 < a.length) keyboardElement.appendChild(delimiter());
            },
        );
    }
    return {
        /**
         * @property {object} keyboardElement jQuery object
         * @param {object} value jQuery object
         */
        set keyboardElement(value) { keyboardElement = value; },
        get keyboardElement() { return keyboardElement; },
        /**
         * @method init
         * @param {string} data JSON keyboard array[keyboard rows array[keyboard keys array[]]]
         */
        init(data) {
            return new Promise((resolve) => {
                keys = [];
                this.keyboardElement.innerHTML = '';
                render(data);
                resolve();
            });
        },
        /**
         * Search key by char or keyCode
         * @param {string} char
         * @param {string} keyCode
         * @returns {object} Returns keyboard key object @see {Key}
         */
        findKey(char, keyCode) {
            if (keys) {
                return keys.filter(
                    (k) => ((k.isSpecial && char !== ' ')
                        ? k.lowercaseKey === keyCode
                        : k.lowercaseKey === char || k.uppercaseKey === char),
                )[0];
            }
            return null;
        },
        /**
         * Unpress all pressed keys for example when window focused out
         * @method freeKeys
         */
        freeKeys() {
            if (keys) {
                keys
                    .filter((v) => v.isDown)
                    .forEach((v) => v.toggleKey());
            }
        },
        highlightKey(char) {
            this.findKey(char).highlightKey();
        },
    };
}
export { Keyboard as default, backslash };

// /* eslint-disable import/extensions */
// import * as css from './keytrainer.css.js';
// /* eslint-disable no-undef */
// /**
//  * HTML element used for render keyboard
//  */
// const divElement = '<div/>';
// /**
//  * In other than ru or en-us layouts the backslash key can have other than \ value
//  * and can be modified by outside script before keyboard initialized and rendered
//  */
// const backslash = (function Backslash() {
//     return {
//         value: '\\',
//     };
// }());
// /**
//  * Function Div
//  * Creates <div/> with attributes
//  * @param {[object]} o Object which represents jQuery HTML element attributes
//  * @returns {object} JQuery object <div/> with or without attributes
//  */
// function jQueryElement(o) {
//     return $(divElement, o);
// }
// /**
//  * Keyboard KeysRow
//  * @returns {object} jQuery div element with CSS class 'keys-row'
//  */
// function keysRow() {
//     return jQueryElement({
//         class: css.keysrow,
//     });
// }
// /**
//  * Delimiter between keyboard keys rows
//  * @returns {object} jQuery div element with CSS class 'keys-delimiter'
//  */
// function delimiter() {
//     return jQueryElement({
//         class: css.delimiter,
//     });
// }
// function keyRow() {
//     return jQueryElement({
//         class: css.keyrow,
//     });
// }
// function keyCell(text) {
//     return jQueryElement({
//         class: css.keycell,
//         text,
//     });
// }
// function keySpecial(text) {
//     return jQueryElement({
//         class: css.keyspecial,
//         text,
//     });
// }
// /**
//  * Keyboard Key
//  * @typedef {object} Key
//  * @param {array} key
//  * Array with key information
//  * ["Class for finger", "Character|SpecialKeySystemName", "UppercaseCharacter|SpecialKeyTitle"]
//  * @method Toogle() Toggles classes between Key up and Key down
//  * @method Highlight() Switches Key between highlighted and regular
//  * @property {string} lowercaseKey Key lowercase character
//  * @property {string} uppercaseKey Key uppercase character
//  * @property {string} classCSS CSS class of Key
//  * @property {string} fingerCSS CSS class of Key for one of the finger
//  * (thumb, index, middle, ring, little)
//  * @property {string} fingerDownCSS CSS class of Key for one of the fingers for pressed key
//  * @property {boolean} IsBackSlash The BackSlach keyboard key is bigger than other
//  * and in case of that used unique CSS class
//  * @property {boolean} IsSpecial A SpecialKey flag
//  * @property {object} keyElement The jQuery element
//  */
// function Key(key) {
//     if (!Array.isArray(key) && key.length !== 3) return null;
//     const [fingerCSS, lowercaseKey, uppercaseKey] = key;
//     const isSpecial = lowercaseKey.length > 1;
//     const isBackSlash = lowercaseKey === backslash.value;
//     let classCSS = (isSpecial || isBackSlash)
//         ? lowercaseKey.replace(backslash.value, css.backslash)
//         : css.key;
//     classCSS += ` ${fingerCSS}`;
//     const keyElement = jQueryElement({ class: classCSS });
//     function render() {
//         if (isSpecial) {
//             keyElement.append(keySpecial(uppercaseKey));
//         } else {
//             keyElement
//                 .append(
//                     keyRow()
//                         .append(keyCell(uppercaseKey))
//                         .append(keyCell()),
//                 )
//                 .append(
//                     keyRow()
//                         .append(keyCell())
//                         .append(keyCell(lowercaseKey)),
//                 );
//         }
//     } render();
//     return {
//         toggleKey() {
//             this.keyElement.toggleClass(this.fingerCSS).toggleClass(this.fingerDownCSS);
//             this.isDown = !this.isDown;
//         },
//         highlightKey() {
//             this.keyElement.toggleClass(css.highlighted);
//         },
//         lowercaseKey,
//         uppercaseKey,
//         class: classCSS,
//         fingerCSS,
//         fingerDownCSS: fingerCSS + css.fingerdown,
//         isBackSlash,
//         isSpecial,
//         keyElement,
//         isDown: false,
//     };
// }
// /**
//  * Keyboard object
//  * loads and render keyboard from json
//  * @typedef Keyboard
//  * @returns {Object} Keyboard object
//  * @method Init() get json, start render
//  * @param {string} src json url
//  * @param {function} callback function called after render completed
//  * @property {array} keys array of Key objects @see Key
//  */
// function Keyboard() {
//     let keys = [];
//     let keyboardElement;
//     function render(rows) {
//         rows.forEach(
//             (rowkeys, i, a) => {
//                 const row = keysRow().appendTo(keyboardElement);
//                 rowkeys.forEach(
//                     (k) => {
//                         const key = new Key(k);
//                         key.keyElement.appendTo(row);
//                         keys.push(key);
//                     }, row, keys,
//                 );
//                 if (i + 1 < a.length) delimiter().appendTo(keyboardElement);
//             },
//         );
//     }
//     return {
//         /**
//          * @property {object} keyboardElement jQuery object
//          * @param {object} value jQuery object
//          */
//         set keyboardElement(value) { keyboardElement = value; },
//         get keyboardElement() { return keyboardElement; },
//         /**
//          * @method init
//          * @param {string} data JSON keyboard array[keyboard rows array[keyboard keys array[]]]
//          */
//         init(data) {
//             return new Promise((resolve) => {
//                 keys = [];
//                 this.keyboardElement.html('');
//                 render(data);
//                 resolve();
//             });
//         },
//         /**
//          * Search key by char or keyCode
//          * @param {string} char
//          * @param {string} keyCode
//          * @returns {object} Returns keyboard key object @see {Key}
//          */
//         findKey(char, keyCode) {
//             if (keys) {
//                 return keys.filter(
//                     (k) => ((k.isSpecial && char !== ' ')
//                         ? k.lowercaseKey === keyCode
//                         : k.lowercaseKey === char || k.uppercaseKey === char),
//                 )[0];
//             }
//             return null;
//         },
//         /**
//          * Unpress all pressed keys for example when window focused out
//          * @method freeKeys
//          */
//         freeKeys() {
//             if (keys) {
//                 keys
//                     .filter((v) => v.isDown)
//                     .forEach((v) => v.toggleKey());
//             }
//         },
//         highlightKey(char) {
//             this.findKey(char).highlightKey();
//         },
//     };
// }
// export { Keyboard as default, backslash };
