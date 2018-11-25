const express = require('express');

const ApiError = require('../ApiError');
const authService = require('../services/authService');
const userService = require('../services/userService');

const auth = express.Router();

auth.route('/auth/login')
	.post(async (req, res, next) => {
		const { email, password } = req.body;
		if (!email || !password) {
			res.locals.error = new ApiError(ApiError.REQUIRED_FIELDS_MISSING);
			next();
		} else {
			const user = await userService.getUser(email);
			if (user === null) {
				res.locals.error = new ApiError(ApiError.UNAUTHORIZED);
				next();
			} else {
				const valid = await authService.verifyPassword(password, user.passwordHash);
				if (!valid) {
					res.locals.error = new ApiError(ApiError.UNAUTHORIZED);
					next();
				} else {
					const authToken = await authService.createAuthToken(user.email);
					res.locals.data = {
						authToken,
						...user._doc,
					};
					next();
				}
			}
		}
	});

auth.route('/auth/verify')
	.post(async (req, res, next) => {
		const { authToken } = req.body;
		if (authToken) {
			const valid = await authService.verifyAuthToken(authToken);
			if (valid === null) {
				res.locals.error = new ApiError(ApiError.UNAUTHORIZED);
			} else {
				res.locals.data = true;
			}
			next();
		} else {
			res.locals.error = new ApiError(ApiError.REQUIRED_FIELDS_MISSING);
			next();
		}
	});

module.exports = auth;
