const { assert } = require('chai');

const database = require('../src/database');

describe('Database', () => {
	let connected = false;
	let wasError = false;

	before(async () => {
		try {
			connected = await database.connect();
		} catch (error) {
			wasError = true;
		}
	});

	after(async () => {
		connected = await database.disconnect();
	});

	describe('connect', () => {
		it('should connect to the database without any errors and return a promise '
			+ 'with boolean true', async () => {
			assert.isTrue(connected);
			assert.isFalse(wasError);
		});
	});
});
