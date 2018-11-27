

function withAuth (request) {
	return request.set('Authorization', `Bearer ${ authToken }`);
}

module.exports = withAuth;
