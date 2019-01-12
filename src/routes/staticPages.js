const contentService = require('../services/contentService');

function staticPages (router) {
	router.route('/static-pages/:pageId')
		.get(async (req, res, next) => {
			try {
				res.locals.data = await contentService.getStaticPage(req.params.pageId);
			} catch (error) {
				res.locals.error = error;
			}
			next();
		});

	return router;
}

module.exports = staticPages;
