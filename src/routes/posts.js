const postService = require('../services/postService');

function users (router) {
	router.route('/posts')
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
		});

	return router;
}

module.exports = users;
