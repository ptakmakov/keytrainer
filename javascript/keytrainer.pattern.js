/* eslint-disable import/extensions */
import * as css from './keytrainer.css.js';
import Controls from './keytrainer.controls.js';

function Pattern() {
    const controls = new Controls();
    let template = null;
    let position = 0;
    let next = null;
    const { pattern, keytrainer } = controls;
    function underscore(char) {
        return (char === ' ') ? '_' : char;
    }
    function space(char) {
        return (char === ' ') ? '&nbsp;' : char;
    }
    return {
        init(data) {
            return new Promise((resolve) => {
                position = 0;
                pattern.html('');
                keytrainer.html('');
                template = Array.from(data).map((c, i) => {
                    const isFirst = i === 0;
                    if (isFirst) next = c;
                    // if (isFirst) this.findKey(c).highlightKey();
                    return {
                        char: c,
                        input: null,
                        // eslint-disable-next-line no-undef
                        charElement: $('<span/>')
                            .html((isFirst) ? underscore(c) : c)
                            .addClass((isFirst) ? css.highlighted : css.type)
                            .appendTo(pattern),
                        // eslint-disable-next-line no-undef
                        inputElement: $('<span/>')
                            .html((isFirst) ? underscore(c) : null)
                            .addClass((isFirst) ? css.highlighted : null)
                            .appendTo(keytrainer),
                    };
                });
                resolve(next);
            });
        },
        renderCurrent(char) {
            const o = template[position];
            position += 1;
            if (char !== o.char) o.inputElement.removeClass(css.highlighted).addClass(css.etext);
            o.input = char;
            o.inputElement.html(space(char));
            o.charElement.html(space(o.char)).removeClass(css.highlighted).addClass(css.typed);
        },
        renderNext() {
            const o = template[position];
            next = o.char;
            o.inputElement.addClass(css.highlighted).html(underscore(o.char));
            o.charElement.addClass(css.highlighted).html(underscore(o.char));
        },
        get isLast() { return position === template.length; },
        get next() { return next; },
    };
}
export { Pattern as default };
