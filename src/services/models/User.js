const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
	email: {
		required: true,
		type: String,
		unique: true,
	},
	password: {
		required: true,
		type: String,
	},
}));

module.exports = User;
