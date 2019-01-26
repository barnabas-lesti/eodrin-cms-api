const contentService = require('../services/contentService');

const sanitizePagePath = rawPagePath => rawPagePath.replace(/"/g, '');

const pages = router => {
	router.route('/pages')
		.get(async (req, res, next) => {
			const {
				pagePath: rawPagePath = '',
				subPages,
			} = req.query;
			const sanitizedPagePath = sanitizePagePath(rawPagePath);
			try {
				if (subPages) {
					res.locals.data = await contentService.getSubPagesFromBucketByPagePath(sanitizedPagePath);
				} else {
					res.locals.data = await contentService.getPageFromBucketByPagePath(sanitizedPagePath);
				}
			} catch (error) {
				res.locals.error = error;
			}
			next();
		});

	return router;
}

module.exports = pages;
