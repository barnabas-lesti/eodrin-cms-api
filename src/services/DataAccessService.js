const Service = require('./Service');

/**
 * API CRUD logic related service base class.
 */
class DataAccessService extends Service {
	constructor () {
		super();

		this.requiredFields = [];
		this.readOnlyFields = [];
	}

	/**
	 * Removes fields from the update object that should not be updated.
	 *
	 * @param {any} update Update object candidate
	 * @returns {any} Sanitized update object
	 */
	removeReadonlyFields (update) {
		const sanitizedUpdate = {};
		for (const fieldName in update) {
			if (this.readOnlyFields.indexOf(fieldName) === -1) {
				sanitizedUpdate[fieldName] = update[fieldName];
			}
		}
		return sanitizedUpdate;
	}
}

module.exports = DataAccessService;
