const mongoose = require('mongoose');

const ApiError = require('./common/ApiError');
const config = require('./common/config');
const logger = require('./common/logger');

/**
 * Database logic handler.
 */
class Database {
	constructor () {
		this._mongoose = mongoose;
		this._logger = logger;

		this._mongoose.set('useFindAndModify', false);
		this._mongoose.set('useCreateIndex', true);
		this._mongoose.set('useNewUrlParser', true);
		this._mongoose.Promise = Promise;
	}

	/**
	 * Connects to MongoDB.
	 *
	 * @returns {Promise<boolean>} Success state
	 * @throws {Error} Cause of the failure
	 */
	async connect () {
		try {
			this._connection = await this._mongoose.connect(config.MONGO_URI);
			this._logger.info('Connected to database');
			return true;
		} catch (error) {
			this._logger.error(error);
			throw new ApiError(ApiError.DATABASE_ERROR);
		}
	}

	/**
	 * Removes all data from a collection. (Should only be used for testing)
	 *
	 * @param {mongoose.Model} Model Collection to clear
	 * @returns {Promise<Boolean>} Success state
	 * @throws {Error} Cause of the failure
	 */
	clearCollection (Model) {
		return new Promise((resolve, reject) => {
			Model.deleteMany({}, error => {
				if (error) {
					reject(error);
				}
				resolve(true);
			});
		});
	}

	/**
	 * Disconnects the client from the active connection if present.
	 *
	 * @returns {Promise<boolean>} Success state
	 * @throws {Error} Cause of the failure
	 */
	disconnect () {
		return new Promise((resolve, reject) => {
			if (this._connection) {
				this._connection.disconnect(error => {
					if (error) {
						reject(error);
					}
					resolve(true);
				});
			} else {
				resolve(true);
			}
		});
	}
}

const database = new Database();
module.exports = database;
