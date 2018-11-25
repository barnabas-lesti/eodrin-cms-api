const _ = require('underscore');

const ApiError = require('../ApiError');
const Middleware = require('./Middleware');

class ResponderMiddleware extends Middleware {
	constructor () {
		super();

		this._blacklist = [ '_id', '__v', 'passwordHash' ];
	}

	/**
	 * Responds to the client based on the "locals" payload.
	 *
	 * @return {void}
	 */
	middleware () {
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
						dataArray.push(this._removeBlacklisted(item));
					}
					responsePayload = dataArray;
				} else if (_.isObject(data)) {
					responsePayload = this._removeBlacklisted(data);
				}
			} else {
				status = 404;
			}

			res.status(status).json(responsePayload);
		};
	}

	/**
	 * Removes blacklisted fields from the data object.
	 *
	 * @param {any} data Data object
	 * @returns {any} Reduced data
	 */
	_removeBlacklisted (data) {
		const paths = data.schema ? data.schema.paths : data;
		const fields = _.without(_.keys(paths), ...this._blacklist);
		return _.pick(data, ...fields);
	}
}

const responder = new ResponderMiddleware();
module.exports = responder;
