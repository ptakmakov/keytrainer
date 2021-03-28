/**
 * Creates a new Stopwatch
 * @class
 */
function Stopwatch(delay) {
    let _start;
    let _current;
    let _interval;
    let _delay = delay ?? 10;
    let _offset = 0;
    let _element = null;
    let _format = "HH:mm:ss.mi";
    function _addZero(i, length) {
        i = String(i), length = length ?? 2;
        return (length < 0 && Math.abs(length) > i.length) ?
            i + "0".repeat(Math.abs(length) - i.length) :
            (length > i.length) ?
                "0".repeat(length - i.length) + i : i;
    }
    function _init() {
        _start = Date.now();
        _current = _start;
    };
    _init();
    return {
        /**
         * @method Reset Resets Stopwatch and reset current value
         */
        Reset: function () {
            this.Stop();
            _init();
            _offset = 0;
        },
        /**
         * @method Start Starts Stopwatch or resumes from current value
         */
        Start: function () {
            if (_offset === 0) _init();
            if (!_interval) _interval = setInterval(
                () => {
                    _current = Date.now();
                    if (_element) _element.text((_format) ? this.ToString(_format) : this.ToString());
                },
                _delay
            );
            if (_offset !== 0) { _start = Date.now() - _offset; _offset = 0; }
        },
        /**
         * @method Stop Stops Stopwatch and hold current value
         */
        Stop: function () {
            if (_interval) clearInterval(_interval);
            _interval = null;
            _offset = this.value.time;
        },
        /**
         * @method ToString
         * Format @see format
         * @param {string} format [='HH:mm:ss.mi'] HH - hours, mm - minutes, ss - seconds, mi - milliseconds
         * @returns {string} "HH:mm:ss.mi"
         * @example
         * // returns 00:00:10.212
         * Stopwatch.ToString();
         * @example
         * // returns 00:10
         * Stopwatch.ToString("mm:ss");
         */
        ToString: function (format) {
            let time = this.value;
            return ((format)?format:_format)
                .replace("HH", _addZero(time.hours))
                .replace("mm", _addZero(time.minutes))
                .replace("ss", _addZero(time.seconds))
                .replace("mi", _addZero(time.milliseconds, 3));
        },
        /**
         * Set stopwatch tick delay
         * @property delay
         * @param {number} value
         */
        set delay(value) { _delay = value; },
        /**
         * Get value
         * @property
         * @returns {object} Object contains properties
         * @property {number} time - total value in milliseconds
         * @property {number} milliseconds - current milliseconds value
         * @property {number} seconds - current seconds value
         * @property {number} minutes - current minutes value
         * @property {number} hours - current hours value
         * @example
         * // returns {time: 0, milliseconds: 0, seconds: 0, minutes: 0, hours: 0}
         * Stopwatch.value;
         */
        get value() {
            const time = _current - _start;
            let mi = time % 1000;
            let s = Math.floor((time - mi) / 1000);
            let m = Math.floor((s - s % 60) / 60);
            let h = Math.floor((m - m % 60) / 60);
            return { time: time, milliseconds: mi, seconds: s % 60, minutes: m % 60, hours: h }
        },
        /**
         * Set jQuery element
         * @property {object} element [=jQuery element] If set update element text after stopwatch start
         * @param {object} element jQuery element
         */
        set element(element) { _element = element; },
        /**
         * Reset default format
         * @property {string} format [='HH:mm:ss.mi'] HH - hours, mm - minutes, ss - seconds, mi - milliseconds
         * @param {string} format HH - hours, mm - minutes, ss - seconds, mi - milliseconds
         */
        set format(format) { _format = (format)? format: _format; }
    }
}
export { Stopwatch }