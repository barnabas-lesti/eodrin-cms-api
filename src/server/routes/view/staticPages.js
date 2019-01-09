import viewTemplate from '../../common/viewTemplate';
import contentService from '../../services/contentService';

export default function staticPages (router) {
	router.route('/:staticPageId')
		.get(async (req, res, next) => {
			res.locals.view = await viewTemplate(contentService.getStaticPage(req.params.staticPageId));
			next();
		});
	return router;
}
