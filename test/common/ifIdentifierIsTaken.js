const { expect } = require('../suite');

const ApiError = require('../../src/ApiError');

function ifIdentifierIsTaken (request, payload, authToken) {
	it(`if identifier is taken: should: have status 400 and "type" field with value "${ ApiError.IDENTIFIER_TAKEN }"`, done => {
		request
			.set('Authorization', `Bearer ${ authToken }`)
			.send(payload)
			.end((err, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.be.an('object');
				expect(res.body.type).to.equal(ApiError.IDENTIFIER_TAKEN);
				done();
			});
	});
}

module.exports = ifIdentifierIsTaken;
