const postService = require('../services/postService');

function posts (router) {
	router.route('/posts')
		.post(async (req, res, next) => {
			try {
				res.locals.data = await postService.createPost(req.body);
			} catch (error) {
				res.locals.error = error;
			}
			next();
		})
		.get(async (req, res, next) => {
			try {
				res.locals.data = await postService.getPosts();
			} catch (error) {
				res.locals.error = error;
			}
			next();
		});

	router.route('/posts/:postId')
		.get(async (req, res, next) => {
			try {
				res.locals.data = await postService.getPost(req.params.postId);
			} catch (error) {
				res.locals.error = error;
			}
			next();
		})
		.patch(async (req, res, next) => {
			try {
				res.locals.data = await postService.updatePost(req.params.postId, req.body);
			} catch (error) {
				res.locals.error = error;
			}
			next();
		})
		.delete(async (req, res, next) => {
			try {
				res.locals.data = await postService.deletePost(req.params.postId);
			} catch (error) {
				res.locals.error = error;
			}
			next();
		});

	return router;
}

module.exports = posts;
