const mongoose = require('mongoose');

const Post = mongoose.model('Post', new mongoose.Schema({
	content: String,
	description: String,
	keywords: Array,
	postId: {
		required: true,
		type: Number,
		unique: true,
	},
	postType: {
		required: true,
		type: String,
	},
	title: String,
}));

module.exports = Post;
