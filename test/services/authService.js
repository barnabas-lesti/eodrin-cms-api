const { assert, expect } = require('chai');

const ApiError = require('../../src/ApiError');
const database = require('../../src/database');
const authService = require('../../src/services/authService');

describe('AuthService', () => {
	describe('loginUser', () => {
		it('should return a promise with the authenticated user if '
			+ 'provided information is valid', async () => {
			assert.fail('NOT_IMPLEMENTED');
		});
		it('should return a promise with null if authentication failed', async () => {
			assert.fail('NOT_IMPLEMENTED');
		});
	});

	describe('verifyPassword', () => {
		it('should return a promise with true if passwords match', async () => {
			assert.fail('NOT_IMPLEMENTED');
		});
		it('should return a promise with false if passwords do not match', async () => {
			assert.fail('NOT_IMPLEMENTED');
		});
	});

	describe('createAuthToken', () => {
		it('should return a promise with the generated auth token from a '
			+ 'valid user object', async () => {
			assert.fail('NOT_IMPLEMENTED');
		});
	});

	describe('verifyAuthToken', () => {
		it('should return a promise with the decrypted user object from a valid authToken', async () => {
			assert.fail('NOT_IMPLEMENTED');
		});
		it('should return a promise with null if the authToken is invalid', async () => {
			assert.fail('NOT_IMPLEMENTED');
		});
	});
});
