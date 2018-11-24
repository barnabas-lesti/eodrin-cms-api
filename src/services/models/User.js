const mongoose = require('mongoose');

const Roles = {
	ADMIN: 'ADMIN',
	EDITOR: 'EDITOR',
	VIEWER: 'VIEWER',
};

const User = mongoose.model('User', new mongoose.Schema({
	email: {
		required: true,
		type: String,
		unique: true,
	},
	passwordHash: {
		required: true,
		type: String,
	},
	roles: {
		default: [ Roles.VIEWER ],
		type: [ String ],
	},
}));

User.Roles = Roles;

module.exports = User;
