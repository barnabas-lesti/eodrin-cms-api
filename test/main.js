process.env.NODE_ENV = 'test';

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

const endpointsDir = path.join(__dirname, './endpoints');
const servicesDir = path.join(__dirname, './services');


/**
 * Checks the --only arg and requires tests according to it.
 *
 * @return {boolean} Is set
 */
function _only () {
	const only = yargs.argv.only;
	return only ? path.join(__dirname, yargs.argv.only) : null;
}

/**
 * Reads and requires all tests from a folder.
 *
 * @param {string} dir Directory path
 * @returns {void}
 */
function _requireTests (dir) {
	return new Promise((resolve, reject) => {
		fs.readdir(dir, (error, files) => {
			if (error) {
				reject(error);
			}
			files.forEach(file => {
				require(path.join(dir, file));
			});
			resolve(true);
		});
	});
}

describe('Eodrin CMS API', () => {
	it('Should say Hi!', done => done());

	require('./database');
	const only = _only();
	if (only) {
		require(only);
	} else {
		describe('Services', async () => await _requireTests(servicesDir));
		describe('Endpoints', async () => await _requireTests(endpointsDir));
	}

});
