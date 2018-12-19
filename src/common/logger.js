const config = require('./config');

/**
 * API logger.
 */
class Logger {
	constructor () {
		this.console = console;
	}

	/**
	 * Info level logger.
	 *
	 * @param  {...any} args Log arguments
	 * @returns {void}
	 */
	info (...args) {
		this._log('info', ...args);
	}

	/**
	 * Error level logger.
	 *
	 * @param  {...any} args Log arguments
	 * @returns {void}
	 */
	error (...args) {
		this._log('error', ...args);
	}

	/**
	 * Warning level logger.
	 *
	 * @param  {...any} args Log arguments
	 * @returns {void}
	 */
	warn (...args) {
		this._log('warn', ...args);
	}

	/**
	 * Base log handler.
	 *
	 * @param {'error'|'info'|'warn'} type Log severity
	 * @param  {...any} args Log arguments
	 * @returns {void}
	 */
	_log (type, ...args) {
		if (config.common.ENV !== 'test') {
			switch (type) {
			case 'error':
				this.console.error(...args);
				break;
			case 'info':
				this.console.info(...args);
				break;
			default:
				this.console.warn(...args);
			}
		}
	}
}

const logger = new Logger();
module.exports = logger;
