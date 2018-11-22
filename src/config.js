const path = require('path');
// const yargs = require('yargs');

const envDirPath = path.join(__dirname, '../env');
process.env.NODE_CONFIG_DIR = envDirPath;

const configLib = require('config');

/**
 * Application configuration object.
 */
const config = {
	AUTH_TOKEN_EXPIRATION: configLib.get('AUTH_TOKEN_EXPIRATION'),
	ENV: configLib.get('ENV'),
	MONGO_URI: configLib.get('MONGO_URI'),
	PORT: configLib.get('PORT'),
	SECRET: configLib.get('SECRET'),
};

module.exports = config;
