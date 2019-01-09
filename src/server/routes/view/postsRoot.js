import viewTemplate from '../../common/viewTemplate';
import contentService from '../../services/contentService';

export default function postsRoot (router) {
	router.route('/posts')
		.get(async (req, res, next) => {
			res.locals.view = await viewTemplate(contentService.getPostGroup());
			next();
		});
	return router;
}
