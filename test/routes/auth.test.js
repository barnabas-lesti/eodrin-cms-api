const { requester, expect } = require('../suite');

const ApiError = require('../../src/ApiError');
const User = require('../../src/models/User');
const authService = require('../../src/services/authService');
const userService = require('../../src/services/userService');

const authFixture = {
	existingUser: {
		email: 'test@mail.com',
		password: 'password1234',
	},
	notExistingUser: {
		email: 'notTest@mail.com',
		password: '9876notPassword',
	},
};

describe('AUTH', () => {
	let validAuthToken;

	beforeEach(async () => {
		await User.deleteMany().exec();
		await userService.createUser(authFixture.existingUser);
		validAuthToken = await authService.createAuthToken(authFixture.existingUser.email);
	});

	afterEach(async () => {
		await User.deleteMany().exec();
	});

	describe('POST /api/auth/login', () => {
		it('should: return the user with the "authToken"', done => {
			requester
				.post('/api/auth/login')
				.send({
					email: authFixture.existingUser.email,
					password: authFixture.existingUser.password,
				})
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('object');
					expect(res.body.email).to.equal(authFixture.existingUser.email);
					expect(res.body.authToken).to.be.a('string');
					done();
				});
		});

		it(`if password is incorrect: should: have status 401, "type" field with value "${ ApiError.UNAUTHORIZED }"`, done => {
			requester
				.post('/api/auth/login')
				.send({
					email: authFixture.existingUser.email,
					password: authFixture.notExistingUser.password,
				})
				.end((err, res) => {
					expect(res).to.have.status(401);
					expect(res.body).to.be.an('object');
					expect(res.body.type).to.equal(ApiError.UNAUTHORIZED);
					done();
				});
		});

		it(`if user was not found: should: have status 401, "type" field with value "${ ApiError.UNAUTHORIZED }"`, done => {
			requester
				.post('/api/auth/login')
				.send({
					email: authFixture.notExistingUser.email,
					password: authFixture.notExistingUser.password,
				})
				.end((err, res) => {
					expect(res).to.have.status(401);
					expect(res.body).to.be.an('object');
					expect(res.body.type).to.equal(ApiError.UNAUTHORIZED);
					done();
				});
		});

		it(`if required fields are missing: should: have status 400, "type" field with value "${ ApiError.REQUIRED_FIELDS_MISSING }"`, done => {
			requester
				.post('/api/auth/login')
				.send({
					email: '',
				})
				.end((err, res) => {
					expect(res).to.have.status(400);
					expect(res.body).to.be.an('object');
					expect(res.body.type).to.equal(ApiError.REQUIRED_FIELDS_MISSING);
					done();
				});
		});
	});

	describe('POST /api/auth/verify', () => {
		it('should: have status 200', done => {

			requester
				.post('/api/auth/verify')
				.send({
					authToken: validAuthToken,
				})
				.end((err, res) => {
					expect(res).to.have.status(200);
					done();
				});
		});

		it(`if "authToken" is invalid: have status 401, "type" field with value "${ ApiError.UNAUTHORIZED }"`, done => {
			requester
				.post('/api/auth/verify')
				.send({
					authToken: 'someInvalidStuffHere',
				})
				.end((err, res) => {
					expect(res).to.have.status(401);
					expect(res.body).to.be.an('object');
					expect(res.body.type).to.equal(ApiError.UNAUTHORIZED);
					done();
				});
		});

		it(`if "authToken" is missing: should: have status 400, "type" field with value "${ ApiError.REQUIRED_FIELDS_MISSING }"`, done => {
			requester
				.post('/api/auth/verify')
				.send({})
				.end((err, res) => {
					expect(res).to.have.status(400);
					expect(res.body).to.be.an('object');
					expect(res.body.type).to.equal(ApiError.REQUIRED_FIELDS_MISSING);
					done();
				});
		});
	});
});
