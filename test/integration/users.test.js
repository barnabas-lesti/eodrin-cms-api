const chai = require('chai');
const chaiHttp = require('chai-http');

const ApiError = require('../../src/ApiError');
const app = require('../../src/app');

chai.use(chaiHttp);

const { expect } = chai;
const request = chai.request(app);

describe('USERS', async () => {
	const freeEmail = 'freeEmail@mail.com';
	const takenEmail = 'takenEmail@mail.com';

	describe('GET /api/users', () => {
		describe('valid request', async () => {
			let response = null;
			let error = null;
			request
				.get('/api/users')
				.end((err, res) => {
					error = err;
					response = res;
				});

			it('should return an array of users', () => {
				expect(error).to.equal(null);
				expect(response).to.not.equal(null);
				expect(response).to.have.status(200);
				expect(response.body).to.be.an('array');
			});
		});
	});

	describe('POST /api/users', () => {
		describe('valid request', async () => {
			const newUser = {
				email: freeEmail,
				password: 'myPassword1234',
			};

			let response = null;
			let error = null;
			request
				.post('/api/users')
				.send(newUser)
				.end((err, res) => {
					error = err;
					response = res;
				});

			it('should save a new user without any errors', () => {
				expect(error).to.equal(null);
				expect(response).to.not.equal(null);
			});
			it('should have status 201 (Created)', () => {
				expect(response).to.have.status(201);
			});
			it('should include a "Location" header with the new users path', () => {
				expect(response).to.have.header('Location');
			});
			it('should return the new users without the "passwordHash" field', () => {
				expect(response.body).to.be.an('object');
				expect(response.body.email).to.equal(newUser.email);
				expect(response.body.passwordHash).to.equal(undefined);
			});
		});

		describe('identifier taken', async () => {
			const newUser = {
				email: takenEmail,
				password: 'myPassword1234',
			};

			let response = null;
			request
				.post('/api/users')
				.send(newUser)
				.end((err, res) => {
					response = res;
				});

			it(`should have status 400 (Bad Request)`, () => {
				expect(response).to.not.equal(null);
				expect(response).to.have.status(400);
			});
			it(`should have "type" field with value "${ ApiError.IDENTIFIER_TAKEN }"`, () => {
				expect(response.body.type).to.equal(ApiError.IDENTIFIER_TAKEN);
			});
		});

		describe('required fields missing from request', async () => {
			const newUser = {
				email: freeEmail,
			};

			let response = null;
			request
				.post('/api/users')
				.send(newUser)
				.end((err, res) => {
					response = res;
				});

			it(`should have status 400 (Bad Request)`, () => {
				expect(response).to.not.equal(null);
				expect(response).to.have.status(400);
			});
			it(`should have "type" property with value "${ ApiError.REQUIRED_FIELDS_MISSING }"`, () => {
				expect(response.body.type).to.equal(ApiError.REQUIRED_FIELDS_MISSING);
			});
		});
	});

	describe('GET /api/users/:email', () => {
		describe('valid request', async () => {
			let response = null;
			let error = null;
			request
				.get(`/api/users/${ takenEmail }`)
				.end((err, res) => {
					error = err;
					response = res;
				});

			it('should return the user without the "passwordHash" field', () => {
				expect(error).to.equal(null);
				expect(response).to.not.equal(null);
				expect(response.body).to.be.an('object');
				expect(response.body.email).to.equal(takenEmail);
				expect(response.body.passwordHash).to.equal(undefined);
			});
		});

		describe('user not found', async () => {
			let response = null;
			request
				.get(`/api/users/${ freeEmail }`)
				.end((err, res) => {
					response = res;
				});

			it('should have status 404 (Not Found)', () => {
				expect(response).to.have.status(404);
			});
		});
	});

	describe('PATCH /api/users/:email', () => {
		describe('valid request', async () => {
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

			it('should update the user without any errors', () => {
				expect(error).to.equal(null);
				expect(response).to.not.equal(null);
			});
			it('should return the updated user without the "password" or "passwordHash" fields', () => {
				expect(response.body).to.be.an('object');
				expect(response.body.email).to.equal(userUpdate.email);
				expect(response.body.content).to.equal(userUpdate.content);
			});
		});

		describe('user not found', async () => {
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
		describe('valid request', async () => {
			let response = null;
			let error = null;
			request
				.delete(`/api/users/${ takenEmail }`)
				.end((err, res) => {
					error = err;
					response = res;
				});

			it('should delete a user without any errors', () => {
				expect(error).to.equal(null);
				expect(response).to.not.equal(null);
			});
		});

		describe('user not found', async () => {
			let response = null;
			request
				.delete(`/api/users/${ freeEmail }`)
				.end((err, res) => {
					response = res;
				});

			it('should have status 404 (Not Found)', () => {
				expect(response).to.have.status(404);
			});
		});
	});
});
