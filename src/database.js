const mongoose = require('mongoose');

const ApiError = require('./ApiError');
const config = require('./config');
const logger = require('./logger');

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
   * Disconnects the client from the active connection if present.
   *
   * @returns {Promise<boolean>} Success state
   * @throws {Error} Cause of the failure
   */
  async disconnect () {
    if (this._connection) {
      return await this._connection.disconnect();
    }
    return true;
  }
}

const database = new Database();
module.exports = database;
