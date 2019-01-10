const contentService = require('../services/contentService');

function posts (router) {
	router.route('/posts')
		.get(async (req, res, next) => {
			try {
				if (req.query.page === 'true') {
					res.locals.data = await contentService.getPost('');
				} else {
					res.locals.data = await contentService.getPosts();
				}
			} catch (error) {
				res.locals.error = error;
			}
			next();
		});

	router.route('/posts/:postGroupId')
		.get(async (req, res, next) => {
			try {
				if (req.query.page === 'true') {
					res.locals.data = await contentService.getPost(req.params.postGroupId);
				} else {
					res.locals.data = await contentService.getPosts(req.params.postGroupId);
				}
			} catch (error) {
				res.locals.error = error;
			}
			next();
		});

	router.route('/posts/:postGroupId/:postId')
		.get(async (req, res, next) => {
			const { postId, postGroupId } = req.params;
			try {
				res.locals.data = await contentService.getPost(postId, postGroupId);
			} catch (error) {
				res.locals.error = error;
			}
			next();
		});

	return router;
}

module.exports = posts;
