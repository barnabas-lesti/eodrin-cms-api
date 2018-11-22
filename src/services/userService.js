const ApiError = require('../ApiError');
const CRUDService = require('./CRUDService');
const User = require('./models/User');

/**
 * User logic related service.
 */
class UserService extends CRUDService {
	constructor () {
		super(User);

		this.requiredFields = [
			'email',
			'password',
		];
		this.readOnlyFields = [
			'email',
		];
	}

	/**
	 * Creates a new user and saves it in the database.
	 *
	 * @param {User} user User to save
	 * @returns {Promise<User>} Created user
	 * @throws {ApiError} Cause of the failure
	 */
	async createUser (user) {
		try {
			const createdUser = await User.create(user);
			return createdUser;
		} catch (error) {
			this.logger.error(error);
			if (error.code === 11000) {
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
			const user = await User.findOne({ email });
			return user;
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
		const sanitizedUpdate = this.sanitizeUpdate(update);
		try {
			const updatedUser = await User.findOneAndUpdate({ email }, sanitizedUpdate, { new: true });
			return updatedUser;
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
