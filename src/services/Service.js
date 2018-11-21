const logger = require('../logger');

/**
 * API Service base class.
 */
class Service {
	constructor (Model) {
		this.logger = logger;
		this.requiredFields = [];
		this.readOnlyFields = [];

		this._Model = Model;
	}

	/**
	 * Returns the service Model.
	 *
	 * @returns {any} Service Model
	 */
	getModel () {
		return this._Model;
	}

	/**
	 * Removes fields from the update object that should not be updated.
	 *
	 * @param {any} update Update object candidate
	 * @returns {any} Sanitized update object
	 */
	sanitizeUpdate (update) {
		const sanitizedUpdate = {};
		for (const fieldName in update) {
			if (this.readOnlyFields.indexOf(fieldName) === -1) {
				sanitizedUpdate[fieldName] = update[fieldName];
			}
		}
		return sanitizedUpdate;
	}
}

module.exports = Service;
