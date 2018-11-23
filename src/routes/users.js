const express = require('express');

// const userService = require('../services/userService');
// const { authService } = require('../services');

const users = express.Router();

users.route('/users')
	.post((req, res) => {

	})
	.get((req, res) => {
		res.json({
			users: [],
		});
	});

users.route('/users/:email')
	.get((req, res) => {

	})
	.put((req, res) => {

	})
	.delete((req, res) => {

	});

module.exports = users;
