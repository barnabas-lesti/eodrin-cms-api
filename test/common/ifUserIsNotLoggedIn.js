const { expect } = require('../suite');

const ApiError = require('../../src/ApiError');

function ifUserIsNotLoggedIn (request) {
	it(`if user is not logged in: should: have status 401, "type" field with value "${ ApiError.UNAUTHORIZED }"`, done => {
		request
			.send({})
			.end((err, res) => {
				expect(err).to.equal(null);
				expect(res).to.not.equal(null);
				expect(res).to.have.status(401);
				expect(res.body).to.be.an('object');
				expect(res.body.type).to.equal(ApiError.UNAUTHORIZED);
				done();
			});
	});
}

module.exports = ifUserIsNotLoggedIn;
