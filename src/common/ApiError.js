class ApiError extends Error {

	/**
	 * Application custom error class.
	 *
	 * @param {String} type Error type, for example: ApiError.SERVICE_ERROR
	 * @param {Object} payload Error message or a payload object
	 */
	constructor (type, payload) {
		super(`Type: "${ type }" api error occurred`);

		this.type = type;
		this.payload = payload;
	}
}

ApiError.SERVICE_ERROR = 'SERVICE_ERROR';
ApiError.DATABASE_ERROR = 'DATABASE_ERROR';

module.exports = ApiError;
