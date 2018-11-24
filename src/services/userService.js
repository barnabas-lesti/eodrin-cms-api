const ApiError = require('../ApiError');
const authService = require('./authService');
const DataAccessService = require('./DataAccessService');
const User = require('./models/User');

/**
 * User logic related service.
 */
class UserService extends DataAccessService {
	constructor () {
		super();

		this.readOnlyFields = [ 'email' ];
		this.requiredFields = [ 'email', 'password' ];
	}

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
				throw new ApiError(ApiError.REQUIRED_FIELDS_MISSING, this.requiredFields);
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
		const sanitizedUpdate = this.removeReadonlyFields(update);
		if (update.password) {
			sanitizedUpdate.passwordHash = await authService.hashPassword(sanitizedUpdate.password);
		}
		try {
			return await User.findOneAndUpdate({ email }, sanitizedUpdate, { new: true });
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
