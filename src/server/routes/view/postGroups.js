import viewTemplate from '../../common/viewTemplate';
import contentService from '../../services/contentService';

export default function postGroups (router) {
	router.route('/posts/:postGroupId')
		.get(async (req, res, next) => {
			res.locals.view = await viewTemplate(contentService.getPostGroup(req.params.postGroupId));
			next();
		});
	return router;
}
