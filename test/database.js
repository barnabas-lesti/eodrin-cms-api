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
		if (connected) {
			await database.disconnect();
		}
	});

	describe('connect', () => {
		it('should connect to the database without any errors and return a promise '
			+ 'with boolean true', async () => {
			assert.isTrue(connected);
			assert.isFalse(wasError);
		});
	});

	describe('disconnect', () => {
		it('should disconnect without any errors and return a promise '
		+ 'with boolean true', async () => {
			try {
				assert.isTrue(await database.disconnect());
			} catch (error) {
				assert.fail('Connection should be able to close without an error');
			}
		});
	});
});
