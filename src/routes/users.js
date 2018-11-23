const express = require('express');

const userService = require('../services/userService');
const ApiError = require('../ApiError');
// const { authService } = require('../services');

const users = express.Router();

users.route('/users')
	.post((req, res) => {
		userService.createUser(req.body)
			.then(user => {
				res.status(201).json(user);
			})
			.catch(error => {
				if (error.type === ApiError.IDENTIFIER_TAKEN || error.type === ApiError.REQUIRED_FIELDS_MISSING) {
					res.status(400).json(error);
				} else {
					res.status(500).json(error);
				}
			});
	})
	.get((req, res) => {
		userService.getUsers()
			.then(users => {
				res.json(users);
			});
	});

users.route('/users/:email')
	.get((req, res) => {
		userService.getUser(req.params.email)
			.then(user => {
				if (user === null) {
					res.status(404).json();
				} else {
					res.json(user);
				}
			})
			.catch(error => {
				res.status(500).json(error);
			});
	})
	.patch((req, res) => {

	})
	.delete((req, res) => {
		userService.deleteUser(req.params.email)
			.then(success => {
				if (success === null) {
					res.status(404).json();
				} else {
					res.json();
				}
			})
			.catch(error => {
				res.status(500).json(error);
			});
	});

module.exports = users;
