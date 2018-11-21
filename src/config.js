const path = require('path');
const yargs = require('yargs');

const envDirPath = path.join(__dirname, '../env');
process.env.NODE_CONFIG_DIR = envDirPath;

const configLib = require('config');

/**
 * Application configuration object.
 */
const config = {
	ENV: configLib.get('ENV'),
	MONGO_URI: configLib.get('MONGO_URI'),
	PORT: configLib.get('PORT'),
};

module.exports = config;
