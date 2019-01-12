const contentService = require('../services/contentService');

const sanitizePostPath = path => path
	.split('/')
	.filter(fragment => fragment !== '' && fragment !== 'posts')
	.join('/');

function posts (router) {
	router.route('/posts*')
		.get(async (req, res, next) => {
			const sanitizedPath = sanitizePostPath(req.path);
			try {
				if (req.query.page === 'true') {
					res.locals.data = await contentService.getPost(sanitizedPath);
				} else {
					res.locals.data = await contentService.getPosts(sanitizedPath);
				}
			} catch (error) {
				res.locals.error = error;
			}
			next();
		});

	return router;
}

module.exports = posts;
