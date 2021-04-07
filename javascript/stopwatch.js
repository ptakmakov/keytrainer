/**
 * Creates a new Stopwatch
 * @typedef Stopwatch
 * @returns {Object} Stopwatch object
 */
function Stopwatch(delay = 10) {
    let startTime = 0;
    let currentTime = 0;
    let updateInterval;
    let updateDelay = delay;
    let pauseOffset = 0;
    let $stopwatchElement = null;
    let $speedmeterElement = null;
    let defaultFormat = 'HH:mm:ss.mi';
    let quantityOfWhatever = 0;
    function padNum(i, length = 2) {
        const s = String(i);
        if (length > 0) return s.padStart(length, '0');
        return s.padEnd(Math.abs(length), '0');
    }
    function currentOffset() {
        return currentTime - startTime;
    }
    function round(number, divider) {
        return Math.round((number + Number.EPSILON) * divider) / divider;
    }
    function init() {
        startTime = Date.now();
        currentTime = startTime;
    } init();
    return {
        /**
         * @method Reset Resets Stopwatch and reset current value
         */
        reset() {
            this.stop();
            init();
            pauseOffset = 0;
        },
        /**
         * @method Start Starts Stopwatch or resumes from current value
         */
        start() {
            if (updateInterval) return;
            if (!updateInterval) {
                if (pauseOffset === 0) init();
                updateInterval = setInterval(
                    () => {
                        currentTime = Date.now();
                        if ($stopwatchElement) {
                            $stopwatchElement.text(
                                (defaultFormat)
                                    ? this.toString(defaultFormat)
                                    : this.toString(),
                            );
                        }
                        if ($speedmeterElement) {
                            $speedmeterElement
                                .text(padNum(this.speedPerMinute(quantityOfWhatever), 4));
                        }
                    },
                    updateDelay,
                );
            }
            if (pauseOffset !== 0) { startTime = Date.now() - pauseOffset; pauseOffset = 0; }
        },
        /**
         * @method Stop Stops Stopwatch and hold current value
         */
        stop() {
            if (updateInterval) clearInterval(updateInterval);
            updateInterval = null;
            pauseOffset = currentOffset();
        },
        /**
         * @method ToString
         * Format @see format
         * @param {string} format [='HH:mm:ss.mi']
         * HH - hours, mm - minutes, ss - seconds, mi - milliseconds
         * @returns {string} "HH:mm:ss.mi"
         * @example
         * // returns 00:00:10.212
         * Stopwatch.ToString();
         * @example
         * // returns 00:10
         * Stopwatch.ToString("mm:ss");
         */
        toString(format) {
            const time = this.value;
            return (format || defaultFormat)
                .replace('HH', padNum(time.hours))
                .replace('mm', padNum(time.minutes))
                .replace('ss', padNum(time.seconds))
                .replace('mi', padNum(time.milliseconds, 3));
        },
        /**
         * @method SpeedPerSecond
         * @param {Number} quantity
         * @returns {Number} Quantity of whatever per second, rounded to 3 decimal places
         */
        speedPerSecond(quantity) {
            const time = currentOffset();
            return (time !== 0) ? round((quantity * 1000) / currentOffset(), 1000) : 0;
        },
        /**
         * @method SpeedPerMinute
         * @param {Number} quantity
         * @returns {Number} Quantity of whatever per minute, rounded to integer
         */
        speedPerMinute(quantity) {
            return round(this.speedPerSecond(quantity) * 60, 1);
        },
        /**
         * Set stopwatch tick delay
         * @property delay
         * @param {number} value
         */
        set delay(value) { updateDelay = value; },
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
            const time = currentOffset();
            const mi = time % 1000;
            const s = Math.floor((time - mi) / 1000);
            const m = Math.floor(((s - s) % 60) / 60);
            const h = Math.floor(((m - m) % 60) / 60);
            return {
                time, milliseconds: mi, seconds: s % 60, minutes: m % 60, hours: h,
            };
        },
        /**
         * Set jQuery element for text view of Stopwatch
         * @see {format} @see {ToString}
         * @property {Object} stopwatchElement [=jQuery element]
         * If set update element text after stopwatch start
         * @param {Object} element jQuery element
         */
        set stopwatchElement(element) { $stopwatchElement = element; },
        /**
         * Set jQuery element for text view of Stopwatch calculated speed of whatever per minute
         * @property {Object} speedmeterElement [=jQuery element]
         * If set updates element text after stopwatch start
         * @param {Object} element jQuery element
         */
        set speedmeterElement(element) { $speedmeterElement = element; },
        /**
         * Set current quantity of whatever, for example - symbols
         * @property {Number} quantity
         * @param {Number} number Sets current quantity of whatever
         */
        set quantity(number) { quantityOfWhatever = number; },
        /**
         * Get current quantity of whatever, for example - symbols
         * @property {Number} quantity
         */
        get quantity() { return quantityOfWhatever; },
        /**
         * Reset default format for Stopwatch text view
         * @property {string} format [='HH:mm:ss.mi']
         * HH - hours, mm - minutes, ss - seconds, mi - milliseconds
         * @param {string} format HH - hours, mm - minutes, ss - seconds, mi - milliseconds
         */
        set format(format) { defaultFormat = format || defaultFormat; },
    };
}
export { Stopwatch as default };
