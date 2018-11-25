const ApiError = require('../ApiError');
const authService = require('../services/authService');
const Middleware = require('./Middleware');

class AuthMiddleware extends Middleware {
	constructor () {
		super();

		this._publicPaths = [
			'/api/auth/login',
			'/api/auth/verify',
		];
	}

	/**
	 * Check the auth token in the header.
	 *
	 * @return {void}
	 */
	middleware () {
		return (req, res, next) => {
			if (this._publicPaths.indexOf(req.path) !== -1) {
				next();
			} else {
				const authHeader = req.get('Authorization');
				if (authHeader) {
					const authToken = authHeader.replace('Bearer ', '');
					authService.verifyAuthToken(authToken)
						.then(data => {
							if (data !== null) {
								next();
							} else {
								res.status(401).json(new ApiError(ApiError.UNAUTHORIZED));
							}
						});
				} else {
					res.status(401).json(new ApiError(ApiError.UNAUTHORIZED));
				}
			}
		};
	}
}

const auth = new AuthMiddleware();
module.exports = auth;
