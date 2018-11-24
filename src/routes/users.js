const express = require('express');

const userService = require('../services/userService');

const users = express.Router();

users.route('/users')
	.post((req, res, next) => {
		userService.createUser(req.body)
			.then(user => {
				res.locals.data = user;
				next();
			})
			.catch(error => {
				res.locals.error = error;
				next();
			});
	})
	.get((req, res, next) => {
		userService.getUsers()
			.then(users => {
				res.locals.data = users;
				next();
			});
	});

users.route('/users/:email')
	.get((req, res, next) => {
		userService.getUser(req.params.email)
			.then(user => {
				res.locals.data = user;
				next();
			})
			.catch(error => {
				res.locals.error = error;
				next();
			});
	})
	.patch((req, res, next) => {
		userService.updateUser(req.params.email, req.body)
			.then(user => {
				res.locals.data = user;
				next();
			})
			.catch(error => {
				res.locals.error = error;
				next();
			});
	})
	.delete((req, res, next) => {
		userService.deleteUser(req.params.email)
			.then(success => {
				res.locals.data = success;
				next();
			})
			.catch(error => {
				res.locals.error = error;
				next();
			});
	});

module.exports = users;
