const contentService = require('../services/contentService');

function settings (router) {
	router.route('/settings')
		.get(async (req, res, next) => {
			try {
				res.locals.data = await contentService.getSettings();
			} catch (error) {
				res.locals.error = error;
			}
			next();
		});

	return router;
}

module.exports = settings;
