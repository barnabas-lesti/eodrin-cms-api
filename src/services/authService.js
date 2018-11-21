const Service = require('./service');

class AuthService extends Service {
	loginUser (email, password) {

	}

	verifyPassword (password, passwordHash) {

	}

	createAuthToken (user) {

	}

	verifyAuthToken (authToken) {

	}
}

const authService = new AuthService();
module.exports = authService;
