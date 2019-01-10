const path = require('path');
const yargs = require('yargs');

process.env.NODE_ENV = yargs.argv.env || process.env.NODE_ENV;
const envDirPath = path.join(__dirname, '../../env');
process.env.NODE_CONFIG_DIR = envDirPath;

const configLib = require('config');

/**
 * Application configuration object.
 */
const config = {
	auth: {
		SECRET: configLib.get('auth.SECRET'),
		TOKEN_EXPIRATION: configLib.get('auth.TOKEN_EXPIRATION'),
	},
	common: {
		ENV: configLib.get('common.ENV'),
		PORT: configLib.get('common.PORT'),
	},
	dataStore: {
		BUCKET_PATH: configLib.get('dataStore.BUCKET_PATH'),
		BUCKET_URI: configLib.get('dataStore.BUCKET_URI'),
		MONGO_URI: configLib.get('dataStore.MONGO_URI'),
	},
};

module.exports = config;
