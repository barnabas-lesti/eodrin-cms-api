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

ApiError.SERVICE_ERROR = 'SERVICE_ERROR';
ApiError.DATABASE_ERROR = 'DATABASE_ERROR';

export default ApiError;
