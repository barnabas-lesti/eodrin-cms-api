const ifUserIsNotLoggedIn = require('../common/ifUserIsNotLoggedIn');
const { requester, expect } = require('../suite');

const ApiError = require('../../src/ApiError');
const database = require('../../src/database');
const User = require('../../src/models/User');
const authService = require('../../src/services/authService');
const userService = require('../../src/services/userService');

describe('USERS', () => {
	const existingUser = {
		email: 'existingEmail@mail.com',
		password: 'existingPassword1234',
		roles: [ User.Roles.VIEWER ],
	};
	const newUser = {
		email: 'newEmail@mail.com',
		password: 'newPassword1234',
	};
	const requiredFieldsMissingUser = {
		email: 'requiredFieldsMissing@mail.com',
	};
	const updatedUser = {
		email: 'updatedUser@mail.com',
		password: 'updatedPassword1234',
		roles: [ User.Roles.ADMIN ],
	};

	let authToken;

	beforeEach(async () => {
		await database.clearCollection(User);
		await userService.createUser(existingUser);
		authToken = await authService.createAuthToken(existingUser.email);
	});

	afterEach(async () => {
		await database.clearCollection(User);
	});

	describe('POST /api/users', () => {
		it('should: return the created user without the "passwordHash" field', done => {
			requester
				.post('/api/users')
				.set('Authorization', `Bearer ${ authToken }`)
				.send(newUser)
				.end((err, res) => {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('object');
					expect(res.body.email).to.equal(newUser.email);
					expect(res.body.passwordHash).to.not.exist;
					done();
				});
		});

		ifUserIsNotLoggedIn(requester.post('/api/users'));

		it(`if identifier is taken: should: have status 400, "type" field with value "${ ApiError.IDENTIFIER_TAKEN }"`, done => {
			requester
				.post('/api/users')
				.set('Authorization', `Bearer ${ authToken }`)
				.send(existingUser)
				.end((err, res) => {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res).to.have.status(400);
					expect(res.body).to.be.an('object');
					expect(res.body.type).to.equal(ApiError.IDENTIFIER_TAKEN);
					done();
				});
		});

		it(`if required fields are missing: should: have status 400, "type" field with value "${ ApiError.REQUIRED_FIELDS_MISSING }"`, done => {
			requester
				.post('/api/users')
				.set('Authorization', `Bearer ${ authToken }`)
				.send(requiredFieldsMissingUser)
				.end((err, res) => {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res).to.have.status(400);
					expect(res.body).to.be.an('object');
					expect(res.body.type).to.equal(ApiError.REQUIRED_FIELDS_MISSING);
					done();
				});
		});
	});

	describe('GET /api/users', () => {
		it('should: not encounter an error, have status 200, body be an array, contain 1 user', done => {
			requester
				.get('/api/users')
				.set('Authorization', `Bearer ${ authToken }`)
				.end((err, res) => {
					expect(err).to.equal(null);
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('array');
					expect(res.body.length).to.equal(1);
					expect(res.body[0].passwordHash).to.not.exist;
					done();
				});
		});

		ifUserIsNotLoggedIn(requester.get('/api/users'));
	});

	describe('GET /api/users/:email', () => {
		it('should: have status 200, not contain the "passwordHash" field', done => {
			requester
				.get(`/api/users/${ existingUser.email }`)
				.set('Authorization', `Bearer ${ authToken }`)
				.end((err, res) => {
					expect(err).to.equal(null);
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('object');
					expect(res.body.passwordHash).to.equal(undefined);
					done();
				});
		});

		ifUserIsNotLoggedIn(requester.get(`/api/users/${ existingUser.email }`));

		it('if user was not found, should: have status 404', done => {
			requester
				.get(`/api/users/${ newUser.email }`)
				.set('Authorization', `Bearer ${ authToken }`)
				.end((err, res) => {
					expect(res).to.have.status(404);
					done();
				});
		});
	});

	describe('PATCH /api/users/:email', () => {
		it('should: update the user, return the updated user without the "passwordHash" field', done => {
			requester
				.patch(`/api/users/${ existingUser.email }`)
				.set('Authorization', `Bearer ${ authToken }`)
				.send(updatedUser)
				.end((err, res) => {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('object');
					expect(res.body.passwordHash).to.not.exist;
					expect(res.body.roles[0]).to.not.equal(existingUser.roles[0]);
					expect(res.body.roles[0]).to.equal(updatedUser.roles[0]);
					done();
				});
		});

		ifUserIsNotLoggedIn(requester.patch(`/api/users/${ existingUser.email }`));

		it('if user was not found, should: have status 404', done => {
			requester
				.patch(`/api/users/${ newUser.email }`)
				.set('Authorization', `Bearer ${ authToken }`)
				.end((err, res) => {
					expect(res).to.have.status(404);
					done();
				});
		});
	});

	describe('DELETE /api/users/:email', () => {
		it('should delete a user without any errors', done => {
			requester
				.delete(`/api/users/${ existingUser.email }`)
				.set('Authorization', `Bearer ${ authToken }`)
				.end((err, res) => {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res).to.have.status(200);
					done();
				});
		});

		ifUserIsNotLoggedIn(requester.delete(`/api/users/${ existingUser.email }`));

		it('if user was not found, should: have status 404', done => {
			requester
				.delete(`/api/users/${ newUser.email }`)
				.set('Authorization', `Bearer ${ authToken }`)
				.end((err, res) => {
					expect(res).to.have.status(404);
					done();
				});
		});
	});
});
