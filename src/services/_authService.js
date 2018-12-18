const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../common/config');
const Service = require('./Service');

class AuthService extends Service {
	/**
	 * Creates a hash from the provided password.
	 *
	 * @param {string} password Password string
	 * @returns {Promise<string>} Hashed password
	 */
	async hashPassword (password) {
		return await bcrypt.hash(password, 10);
	}

	/**
	 * Check if the provided password and hash match.
	 *
	 * @param {string} password Password to check
	 * @param {string} passwordHash Password hash
	 * @returns {Promise<boolean>} Promise containing the result boolean
	 */
	async verifyPassword (password, passwordHash) {
		return await bcrypt.compare(password, passwordHash);
	}

	/**
	 * Creates an auth token from an email address.
	 *
	 * @param {string} email Email address
	 * @returns {Promise<string|null>} Auth token promise
	 */
	createAuthToken (email) {
		return new Promise(resolve => {
			jwt.sign({ data: email }, config.SECRET, { expiresIn: config.AUTH_TOKEN_EXPIRATION }, (err, token) => {
				if (err) {
					this.logger.error(err);
					resolve(null);
				}
				resolve(token);
			});
		});
	}

	/**
	 * Verifies the token string and returns the decoded email or null if token is invalid.
	 *
	 * @param {string} authToken JWT token
	 * @returns {Promise<string|null>} Promise with the decoded email
	 */
	verifyAuthToken (authToken) {
		return new Promise(resolve => {
			jwt.verify(authToken, config.SECRET, (err, decoded) => {
				if (err) {
					this.logger.error(err);
					resolve(null);
				}
				resolve(decoded.data);
			});
		});
	}
}

const authService = new AuthService();
module.exports = authService;
