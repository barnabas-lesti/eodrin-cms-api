const ApiError = require('../common/ApiError');
const User = require('../models/User');
const authService = require('./authService');
const Service = require('./Service');

/**
 * User logic related service.
 */
class UserService extends Service {
	/**
	 * Creates a new user and saves it in the database.
	 *
	 * @param {User} user User to save
	 * @returns {Promise<User>} Created user
	 * @throws {ApiError} Cause of the failure
	 */
	async createUser (user) {
		const userToCreate = user;
		try {
			if (!user.password) {
				throw new ApiError(ApiError.REQUIRED_FIELDS_MISSING);
			}
			userToCreate.passwordHash = await authService.hashPassword(user.password);
			return await User.create(userToCreate);
		} catch (error) {
			this.logger.error(error);
			if (error instanceof ApiError) {
				throw error;
			} else if (error.code === 11000) {
				throw new ApiError(ApiError.IDENTIFIER_TAKEN);
			} else if (error.message && error.message.indexOf('is required') !== -1) {
				throw new ApiError(ApiError.REQUIRED_FIELDS_MISSING);
			} else {
				throw new ApiError(ApiError.SERVICE_ERROR);
			}
		}
	}

	/**
	 * Searches for the user with the provided email.
	 *
	 * @param {string} email Users email address
	 * @returns {Promise<User>} Found user
	 * @throws {ApiError} Cause of the failure
	 */
	async getUser (email) {
		try {
			return await User.findOne({ email });
		} catch (error) {
			this.logger.error(error);
			throw new ApiError(ApiError.SERVICE_ERROR);
		}
	}

	/**
	 * Searches for users based on query.
	 *
	 * @param {object} query Search query
	 * @returns {Promise<[User]>} Found users
	 * @throws {ApiError} Cause of the failure
	 */
	async getUsers (query = {}) {
		try {
			return await User.find(query);
		} catch (error) {
			this.logger.error(error);
			throw new ApiError(ApiError.SERVICE_ERROR);
		}
	}

	/**
	 * Updated the user with the provided data.
	 *
	 * @param {string} email User email address
	 * @param {User} update Updated user data
	 * @returns {Promise<User>} Updated user
	 * @throws {ApiError} Cause of the failure
	 */
	async updateUser (email, update) {
		if (update.password) {
			update.passwordHash = await authService.hashPassword(update.password);
		}
		try {
			return await User.findOneAndUpdate({ email }, update, { new: true });
		} catch (error) {
			this.logger.error(error);
			throw new ApiError(ApiError.SERVICE_ERROR);
		}
	}

	/**
	 * Deletes a user based on the email address.
	 *
	 * @param {string} email User email address
	 * @returns {Promise<true|null>} True if user was found, null if not
	 * @throws {ApiError} Cause of the failure
	 */
	async deleteUser (email) {
		try {
			const result = await User.findOneAndDelete({ email });
			return result !== null ? true : null;
		} catch (error) {
			this.logger.error(error);
			throw new ApiError(ApiError.SERVICE_ERROR);
		}
	}
}

const userService = new UserService();
module.exports = userService;
