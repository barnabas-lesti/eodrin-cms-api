process.env.NODE_ENV = 'test';

const fs = require('fs');
const path = require('path');

const endpointsDir = path.join(__dirname, './endpoints');
const servicesDir = path.join(__dirname, './services');

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

	describe('Services', async () => await _requireTests(servicesDir));

	describe('Endpoints', async () => await _requireTests(endpointsDir));
});
