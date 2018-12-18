/**
 * API Error class.
 */
class ApiError extends Error {
	constructor (type, payload) {
		super(`Type: "${ type }" api error occurred`);

		this.type = type;
		this.payload = payload;
	}
}

ApiError.IDENTIFIER_TAKEN = 'IDENTIFIER_TAKEN';
ApiError.REQUIRED_FIELDS_MISSING = 'REQUIRED_FIELDS_MISSING';
ApiError.SERVICE_ERROR = 'SERVICE_ERROR';
ApiError.DATABASE_ERROR = 'DATABASE_ERROR';
ApiError.UNAUTHORIZED = 'UNAUTHORIZED';

module.exports = ApiError;
