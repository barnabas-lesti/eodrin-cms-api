const contentService = require('../services/contentService');

const pages = router => {
	router.route('/pages')
		.get(async (req, res, next) => {
			const {
				pagePath,
				pageTypes,
			} = req.query;
			try {
				if (pagePath) {
					res.locals.data = await contentService.getPageByPagePath(pagePath);
				} else if (pageTypes) {
					const pageTypesArray = pageTypes.split(',').map(type => type.replace(/"/g, '').trim());
					res.locals.data = await contentService.getPagesByPageTypes(pageTypesArray);
				}
			} catch (error) {
				res.locals.error = error;
			}
			next();
		});

	return router;
}

module.exports = pages;
