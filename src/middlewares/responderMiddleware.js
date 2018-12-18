const ApiError = require('../common/ApiError');

/**
 * Responds to the client based on the response locals payload.
 *
 * @return {void}
 */
function responderMiddleware () {
	return (req, res) => {
		const { data, error } = res.locals;

		let status = 200;
		let responsePayload = data;

		if (error) {
			responsePayload = error;
			switch (error.type) {
			case ApiError.IDENTIFIER_TAKEN:
				status = 400;
				break;
			case ApiError.REQUIRED_FIELDS_MISSING:
				status = 400;
				break;
			case ApiError.UNAUTHORIZED:
				status = 401;
				break;
			default:
				status = 500;
			}

		} else {
			status = 404;
		}

		res.status(status).json(responsePayload);
		return;
	};
}

module.exports = responderMiddleware;
