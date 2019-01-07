import appRootPath from 'app-root-path';
import path from 'path';
// const yargs = require('yargs');

const envDirPath = path.resolve(appRootPath.path, 'env');
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
	dataStore: {
		BUCKET_PATH: configLib.get('dataStore.BUCKET_PATH'),
		BUCKET_URI: configLib.get('dataStore.BUCKET_URI'),
		MONGO_URI: configLib.get('dataStore.MONGO_URI'),
	},
};

export default config;
