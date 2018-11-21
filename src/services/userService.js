const ApiError = require('../ApiError');
const User = require('./models/User');
const Service = require('./Service');

class UserService extends Service {
	constructor () {
		super(User);

		this._requiredFields = [
			'email',
			'password',
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
				throw new ApiError(ApiError.REQUIRED_FIELDS_MISSING, this._requiredFields);
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

	async updateUser (email, update) {
		try {
			const updatedUser = await User.findOneAndUpdate({ email }, update);
			return updatedUser;
		} catch (error) {
			this.logger.error(error);
			return null;
		}
	}

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
