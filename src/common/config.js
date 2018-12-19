const path = require('path');
// const yargs = require('yargs');

const envDirPath = path.join(__dirname, '../../env');
process.env.NODE_CONFIG_DIR = envDirPath;
// process.env.NODE_ENV = yargs.argv.env || process.env.NODE_ENV;

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
	db: {
		MONGO_URI: configLib.get('db.MONGO_URI'),
	},
};

module.exports = config;
