const _ = require('underscore');

const ApiError = require('../ApiError');

const _blacklist = [
	'_id',
	'__v',
	'passwordHash',
];

/**
* Removes blacklisted fields from the data object.
*
* @param {any} data Data object
* @returns {any} Reduced data
*/
function _removeBlacklisted (data) {
	const paths = data.schema ? data.schema.paths : data;
	const fields = _.without(_.keys(paths), ..._blacklist);
	return _.pick(data, ...fields);
}

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

		} else if (data) {
			if (_.isArray(data)) {
				const dataArray = [];
				for (const item of data) {
					dataArray.push(_removeBlacklisted(item));
				}
				responsePayload = dataArray;
			} else if (_.isObject(data)) {
				responsePayload = _removeBlacklisted(data);
			}
		} else {
			status = 404;
		}

		res.status(status).json(responsePayload);
	};
}

module.exports = responderMiddleware;
