const config = require('./config');

class Logger {
	constructor () {
		this.console = console;
	}

	info (...args) {
		this._log('info', ...args);
	}

	error (...args) {
		this._log('error', ...args);
	}

	warn (...args) {
		this._log('warn', ...args);
	}

	_log (type, ...args) {
		if (config.ENV !== 'test') {
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
