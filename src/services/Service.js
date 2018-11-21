const logger = require('../logger');

class Service {
	constructor (Model) {
		this.logger = logger;
		this._Model = Model;
	}

	getModel () {
		return this._Model;
	}
}

module.exports = Service;
