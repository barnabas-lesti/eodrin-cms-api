const ApiError = require('../ApiError');
const authService = require('../services/authService');

const _publicPaths = [
	'/api/auth/login',
	'/api/auth/verify',
];

/**
 * Check the auth token in the header.
 *
 * @return {void}
 */
function authMiddleware () {
	return async (req, res, next) => {
		if (_publicPaths.indexOf(req.path) !== -1) {
			next();
			return;
		}

		const authHeader = req.get('Authorization');
		if (authHeader) {
			const authToken = authHeader.replace('Bearer ', '');
			const data = await authService.verifyAuthToken(authToken);
			if (data !== null) {
				next();
				return;
			}
		}

		res.status(401).json(new ApiError(ApiError.UNAUTHORIZED));
		return;
	};
}

module.exports = authMiddleware;