const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../src/app');
const ApiError = require('../../src/ApiError');

chai.use(chaiHttp);
chai.should();

const request = chai.request(app);

describe('USERS', () => {
	const existingEmail = 'existing@mail.com';

	describe('GET /api/users', () => { 
		it('should return an array containing users', async () => { 
			request
				.get('/api/users')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.users.should.be.a('array');
					res.should.be
				});
		});
	});

	// describe('POST /api/users', () => { 
	// 	it('should create a new user and return it', async () => {
	// 		const newUserThatCanBeCreated = {
	// 			email: 'newUser@mail.com',
	// 			password: 'password1234',
	// 		};

	// 		request
	// 			.post('/api/users')
	// 			.send(newUserThatCanBeCreated)
	// 			.end((err, res) => {
	// 				expect(res.statusCode).to.equal(200);
	// 				expect(res.body.user).to.be.an('object');
	// 				expect(res.body.user.email).to.equal(newUserThatCanBeCreated.email);
	// 			});
	// 	});

	// 	it(`should return with status 500 and an error object with type "${ApiError.IDENTIFIER_TAKEN}" if email is already taken`, async () => {
	// 		const newUserThatsEmailIsAlreadyTaken = {
	// 			email: existingEmail,
	// 			password: 'password1234',
	// 		};

	// 		request
	// 			.post('/api/users')
	// 			.send(newUserThatsEmailIsAlreadyTaken)
	// 			.end((err, res) => {
	// 				expect(res.statusCode).to.equal(500);
	// 				expect(res.body.error).to.be.an('object');
	// 				expect(res.body.error.type).to.equal(ApiError.IDENTIFIER_TAKEN);
	// 			});
	// 	});
	// });

	// describe('GET /api/users/:email', () => { 
	// 	it('should return a specific user based on the email', async () => { 
	// 		request
	// 			.get(`/api/users/${ existingEmail }`)
	// 			.end((err, res) => {
	// 				expect(res.statusCode).to.equal(200);
	// 				expect(res.body.user).to.be.an('object');
	// 				expect(res.body.user.email).to.equal(existingEmail);
	// 			});
	// 	});

	// 	it(`should not return the users password or it's hash`, async () => { 
	// 		request
	// 			.get(`/api/users/${ existingEmail }`)
	// 			.end((err, res) => {
	// 				expect(res.statusCode).to.equal(200);
	// 				expect(res.body.user).to.be.an('object');
	// 				expect(res.body.user.password).to.be.undefined;
	// 				expect(res.body.user.passwordHash).to.be.undefined;
	// 			});
	// 	});

	// 	it(`should return a user object with value null if user was not found`, async () => {
	// 		const nonExistingEmail = 'nonExistingEmail@mail.com';

	// 		request
	// 			.get(`/api/users/${ nonExistingEmail }`)
	// 			.end((err, res) => {
	// 				expect(res.statusCode).to.equal(200);
	// 				expect(res.body.user).to.equal(null);
	// 			});
	// 	});
	// });

	// describe('PUT /api/users/:email', () => { 
	// 	it('should update a specific user based on the email and return the updated version', async () => {
	// 		const userWithUpdatedFields = {
	// 			email: existingEmail,
	// 			password: 'password1234',
	// 			content: 'New value of this field'
	// 		};

	// 		request
	// 			.put(`/api/users/${ existingEmail }`)
	// 			.send(userWithUpdatedFields)
	// 			.end((err, res) => {
	// 				expect(res.statusCode).to.equal(200);
	// 				expect(res.body.user).to.be.an('object');
	// 				expect(res.body.user.email).to.equal(existingEmail);
	// 				expect(res.body.user.content).to.equal(userWithUpdatedFields.content);
	// 			});
	// 	});
	// 	it(`should not update the email field`, async () => {
	// 		const userWhereEmailIsChanged = {
	// 			email: 'someChanged@mail.com',
	// 			password: 'password1234'
	// 		};
	// 		request
	// 			.put(`/api/users/${ existingEmail }`)
	// 			.send(userWhereEmailIsChanged)
	// 			.end((err, res) => {
	// 				expect(res.statusCode).to.equal(200);
	// 				expect(res.body.user).to.be.an('object');
	// 				expect(res.body.user.email).to.equal(existingEmail);
	// 			});
	// 	});

	// 	it(`should return a user object with value null if user was not found`, async () => {
	// 		const nonExistingEmail = 'nonExistingEmail@mail.com';
	// 		request
	// 			.put(`/api/users/${ nonExistingEmail }`)
	// 			.send({})
	// 			.end((err, res) => {
	// 				expect(res.statusCode).to.equal(200);
	// 				expect(res.body.user).to.equal(null);
	// 			});
	// 	});
	// });

	// describe('DELETE /api/users', () => { 
	// 	it('should remove the user and return with status "OK"', async () => { 
	// 		request
	// 			.get('/api/users')
	// 			.end((err, res) => {
	// 				expect(res.statusCode).to.equal(200);
	// 				expect(res.body.users).to.be.an('array');
	// 			});
	// 	});

	// 	it('should remove the user and return the email address', async () => { 
	// 		request
	// 			.get('/api/users')
	// 			.end((err, res) => {
	// 				expect(res.statusCode).to.equal(200);
	// 				expect(res.body.users).to.be.an('array');
	// 			});
	// 	});
	// });
});
