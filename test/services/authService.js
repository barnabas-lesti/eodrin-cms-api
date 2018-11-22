const { assert, expect } = require('chai');

const database = require('../../src/database');
const authService = require('../../src/services/authService');
const userService = require('../../src/services/userService');

describe('AuthService', () => {
	const validUser = {
		email: 'test@mail.com',
		password: 'validPassword1234',
	};

	let hashedValidPassword;
	let authToken;

	before(async () => {
		await database.connect();
		await database.clearCollection(userService.getModel());

		await userService.createUser(validUser);
		hashedValidPassword = await authService.hashPassword(validUser.password);
		authToken = await authService.createAuthToken(validUser);
	});

	after(async () => {
		await database.clearCollection(userService.getModel());
		await database.disconnect();
	});

	describe('hashPassword', () => {
		it('should return a promise with the hashed password', async () => {
			assert.isDefined(hashedValidPassword);
			assert.isString(hashedValidPassword);
			expect(hashedValidPassword).to.not.equal(validUser.password);
		});
	});

	describe('verifyPassword', () => {
		it('should return a promise with true if passwords match', async () => {
			const match = await authService.verifyPassword(validUser.password, hashedValidPassword);
			assert.isTrue(match);
		});
		it('should return a promise with false if passwords do not match', async () => {
			const match = await authService.verifyPassword('invalidPass9876', hashedValidPassword);
			assert.isFalse(match);
		});
	});

	describe('createAuthToken', () => {
		it('should return a promise with the generated auth token from a '
			+ 'valid user object', async () => {
			assert.isDefined(authToken);
			assert.isString(authToken);
		});
	});

	describe('verifyAuthToken', () => {
		it('should return a promise with the decrypted user object from a valid authToken', async () => {
			const user = await authService.verifyAuthToken(authToken);
			assert.isDefined(user);
			assert.isNotNull(user);
			assert.isObject(user);
			expect(user.email).to.equal(validUser.email);
		});
		it('should return a promise with null if the authToken is invalid', async () => {
			const notUser = await authService.verifyAuthToken('someRandomTokenLikeThingHere1234');
			assert.isDefined(notUser);
			assert.isNull(notUser);
		});
	});
});
