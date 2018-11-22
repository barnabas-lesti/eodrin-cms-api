const chai = require('chai');
const chaiHttp = require('chai-http');

const { assert, expect } = chai;

const database = require('../../src/database');
const app = require('../../src/main');
const userService = require('../../src/services/userService');

chai.use(chaiHttp);

describe('Users', () => {
	const validUser = {
		email: 'valid@mail.com',
		password: 'validPassword1234',
	};

	before(async () => {
		await database.connect();
		await database.clearCollection(userService.getModel());
	});

	after(async () => {
		await database.clearCollection(userService.getModel());
		await database.disconnect();
	});

	describe('GET /api/users', () => {
		it('should create a user and return it if request body is valid', async () => {
			const response = await chai.request(app)
				.put('/api/users')
				.send(validUser);
			expect(response).to.have.status(200);
		});
		it('should return status 400 if required fields are missing', async () => {
			assert.fail('NOT_IMPLEMENTED');
		});
	});
});
