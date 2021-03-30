/**
 * Creates a new Stopwatch
 * @class
 */
function Stopwatch(delay) {
    let _start = 0;
    let _current = 0;
    let _interval;
    let _delay = delay ?? 10;
    let _offset = 0;
    let _timerElement = null;
    let _speedElement = null;
    let _format = "HH:mm:ss.mi";
    let _quantity = 0;
    function _addZero(i, length) {
        i = String(i), length = length ?? 2;
        return (length < 0 && Math.abs(length) > i.length) ?
            i + "0".repeat(Math.abs(length) - i.length) :
            (length > i.length) ?
                "0".repeat(length - i.length) + i : i;
    }
    function _time() {
        return _current - _start;
    }
    function _round(number, divider) {
        return Math.round((number + Number.EPSILON) * divider) / divider
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
            if (_interval) return;
            if (!_interval) {
                if (_offset === 0) _init();
                _interval = setInterval(
                    () => {
                        _current = Date.now();
                        if (_timerElement) _timerElement.text((_format) ? this.ToString(_format) : this.ToString());
                        if (_speedElement) _speedElement.text(_addZero(this.SpeedPerMinute(_quantity), 4));
                    },
                    _delay,
                );
            }
            if (_offset !== 0) { _start = Date.now() - _offset; _offset = 0; }
        },
        /**
         * @method Stop Stops Stopwatch and hold current value
         */
        Stop: function () {
            if (_interval) clearInterval(_interval);
            _interval = null;
            _offset = _time();
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
            return ((format) ? format : _format)
                .replace("HH", _addZero(time.hours))
                .replace("mm", _addZero(time.minutes))
                .replace("ss", _addZero(time.seconds))
                .replace("mi", _addZero(time.milliseconds, 3));
        },
        /**
         * @method SpeedPerSecond
         * @param {Number} quantity 
         * @returns {Number} Quantity of whatever per second, rounded to 3 decimal places
         */
        SpeedPerSecond: function (quantity) {
            let time = _time();
            return (time != 0) ? _round(quantity * 1000 / _time(), 1000) : 0;
        },
        /**
         * @method SpeedPerMinute
         * @param {Number} quantity 
         * @returns {Number} Quantity of whatever per minute, rounded to integer
         */
        SpeedPerMinute: function (quantity) {
            return _round(this.SpeedPerSecond(quantity) * 60, 1);
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
            const time = _time();
            let mi = time % 1000;
            let s = Math.floor((time - mi) / 1000);
            let m = Math.floor((s - s % 60) / 60);
            let h = Math.floor((m - m % 60) / 60);
            return { time: time, milliseconds: mi, seconds: s % 60, minutes: m % 60, hours: h }
        },
        /**
         * Set jQuery element for text view of Stopwatch
         * @see {format} @see {ToString}
         * @property {Object} timerElement [=jQuery element] If set update element text after stopwatch start
         * @param {Object} element jQuery element
         */
        set timerElement(element) { _timerElement = element; },
        /**
         * Set jQuery element for text view of Stopwatch calculated speed of whatever per minute
         * @property {Object} speedElement [=jQuery element] If set update element text after stopwatch start
         * @param {Object} element jQuery element
         */
        set speedElement(element) { _speedElement = element; },
        /**
         * Set current quantity of whatever, for example - symbols
         * @property {Number} quantity
         * @param {Number} number Sets current quantity of whatever
         */
        set quantity(number) { _quantity = number; },
        /**
         * Reset default format for Stopwatch text view
         * @property {string} format [='HH:mm:ss.mi'] HH - hours, mm - minutes, ss - seconds, mi - milliseconds
         * @param {string} format HH - hours, mm - minutes, ss - seconds, mi - milliseconds
         */
        set format(format) { _format = (format) ? format : _format; }
    }
}
export { Stopwatch }