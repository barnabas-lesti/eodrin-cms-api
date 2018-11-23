const { requester, expect } = require('../suite');

const database = require('../../src/database');
const userService = require('../../src/services/userService');
const ApiError = require('../../src/ApiError');

describe('USERS', () => {
	const existingUser = {
		email: 'existingEmail@mail.com',
		password: 'existingPassword1234',
	};
	const newUser = {
		email: 'newEmail@mail.com',
		password: 'newPassword1234',
	};
	const requiredFieldsMissingUser = {
		email: 'requiredFieldsMissing@mail.com',
	};

	beforeEach(async () => {
		await database.clearCollection(userService.getModel());
		await userService.createUser(existingUser);
	});

	afterEach(async () => {
		await database.clearCollection(userService.getModel());
	});

	describe('GET /api/users', () => {
		it('should: not encounter an error, have status 200, body be an array, contain 1 user', done => {
			requester
				.get('/api/users')
				.end((err, res) => {
					expect(err).to.equal(null);
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('array');
					expect(res.body.length).to.equal(1);
					done();
				});
		});
	});

	describe('GET /api/users/:email', () => {
		it('should: have status 200, not contain the "passwordHash" field', done => {
			requester
				.get(`/api/users/${ existingUser.email }`)
				.end((err, res) => {
					expect(err).to.equal(null);
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('object');
					expect(res.body.passwordHash).to.equal(undefined);
					done();
				});
		});

		it('if user was not found, should: have status 404', done => {
			requester
				.get(`/api/users/${ newUser.email }`)
				.end((err, res) => {
					expect(res).to.have.status(404);
					done();
				});
		});
	});

	describe('POST /api/users', () => {
		it('should: have status 201, not return "passwordHash" field', done => {
			requester
				.post('/api/users')
				.send(newUser)
				.end((err, res) => {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res).to.have.status(201);
					expect(res.body).to.be.an('object');
					expect(res.body.email).to.equal(newUser.email);
					expect(res.body.passwordHash).to.not.exist;
					done();
				});
		});

		it(`if identifier is taken: should: have status 400, "type" field with value"${ ApiError.IDENTIFIER_TAKEN }"`, done => {
			requester
				.post('/api/users')
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

		it(`if required fields are missing: should: have status 400, "type" field with value"${ ApiError.REQUIRED_FIELDS_MISSING }"`, done => {
			requester
				.post('/api/users')
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

	describe('PATCH /api/users/:email', () => {
		it('should: update the user, return the updated user without the "passwordHash" field', () => {
			requester
				.patch(`/api/users/${ existingUser.email }`)
				.send(updatedUser)
				.end((err, res) => {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('object');
					expect(res.body.content).to.equal(updatedUser.content);
					done();
				});
		});
		it('should return the updated user without the "password" or "passwordHash" fields', () => {
			expect(response.body).to.be.an('object');
			expect(response.body.email).to.equal(userUpdate.email);
			expect(response.body.content).to.equal(userUpdate.content);
		});

		describe('if request is valid', () => {
			const userUpdate = {
				content: 'updated content!',
				email: takenEmail,
			};

			let response = null;
			let error = null;
			request
				.patch(`/api/users/${ takenEmail }`)
				.send(userUpdate)
				.end((err, res) => {
					error = err;
					response = res;
				});


		});

		describe('if user was not found', () => {
			let response = null;
			request
				.patch(`/api/users/${ freeEmail }`)
				.end((err, res) => {
					response = res;
				});

			it('should have status 404 (Not Found)', () => {
				expect(response).to.have.status(404);
			});
		});
	});

	describe('DELETE /api/users/:email', () => {
		it('should delete a user without any errors', done => {
			requester
				.delete(`/api/users/${ existingUser.email }`)
				.end((err, res) => {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res).to.have.status(200);
					done();
				});
		});

		it('should have status 404 (Not Found) if user was not found', done => {
			requester
				.delete(`/api/users/${ newUser.email }`)
				.end((err, res) => {
					expect(res).to.have.status(404);
					done();
				});
		});
	});
});
