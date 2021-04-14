/* eslint-disable import/extensions */
import * as css from './keytrainer.css.js';

function Pattern() {
    let template = '';
    return {
        pattern: {},
        keytrainer: {},
        set template(data) {
            this.pattern.html('');
            this.keytrainer.html('');
            template = Array.from(data).map((c, i) => {
                const isFirst = i === 0;
                // if (isFirst) this.findKey(c).highlightKey();
                return {
                    char: c,
                    input: null,
                    // eslint-disable-next-line no-undef
                    charElement: $('<span/>')
                        .text(c)
                        .addClass((isFirst) ? css.highlighted : css.type)
                        .appendTo(this.pattern),
                    // eslint-disable-next-line no-undef
                    inputElement: $('<span/>')
                        .text((isFirst) ? c : null)
                        .addClass((isFirst) ? css.highlighted : null)
                        .appendTo(this.keytrainer),
                };
            });
        },
        get template() { return template; },
    };
}
export { Pattern as default };
