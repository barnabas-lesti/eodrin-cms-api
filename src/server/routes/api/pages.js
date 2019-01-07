import contentService from '../../services/contentService';

export default function pages (router) {
	router.route('/pages')
		.get(async (req, res, next) => {
			try {
				const sanitizedPagePath = req.query.pagePath.replace(/"/g, '');
				res.locals.data = await contentService.getPage(sanitizedPagePath);
			} catch (error) {
				res.locals.error = error;
			}
			next();
		});

	return router;
}
