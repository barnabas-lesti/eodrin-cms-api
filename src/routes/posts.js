const express = require('express');

const postService = require('../services/postService');

const posts = express.Router();

posts.route('/posts')
	.post((req, res, next) => {
		postService.createPost(req.body)
			.then(post => {
				res.locals.data = post;
				next();
			})
			.catch(error => {
				res.locals.error = error;
				next();
			});
	})
	.get((req, res, next) => {
		postService.getPosts()
			.then(posts => {
				res.locals.data = posts;
				next();
			});
	});

posts.route('/posts/:postId')
	.get((req, res, next) => {
		postService.getPost(req.params.postId)
			.then(post => {
				res.locals.data = post;
				next();
			})
			.catch(error => {
				res.locals.error = error;
				next();
			});
	})
	.patch((req, res, next) => {
		postService.updatePost(req.params.postId, req.body)
			.then(post => {
				res.locals.data = post;
				next();
			})
			.catch(error => {
				res.locals.error = error;
				next();
			});
	})
	.delete((req, res, next) => {
		postService.deletePost(req.params.postId)
			.then(success => {
				res.locals.data = success;
				next();
			})
			.catch(error => {
				res.locals.error = error;
				next();
			});
	});

module.exports = posts;
