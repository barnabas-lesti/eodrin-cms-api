import React from 'react';
import { renderToString } from 'react-dom/server';

import contentService from '../../services/contentService';

import App from '../../../client/App';

export default function root (router) {
	router.route('**')
		.get(async (req, res, next) => {
			const pageData = await contentService.getPage(req.path);
			const template = pageData !== null ? pageData.pageTemplate : 'NotFoundTemplate';
			const initialData = {
				template,
			};
			const content = renderToString(<App template={template} />);

			res.locals.view = `
				<!DOCTYPE html>
				<html>
					<head>
						<title>SSR with RR</title>
						<script src="/assets/client.js" defer></script>
						<script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};</script>
					</head>
					<body>
						<div id="app">${content}</div>
					</body>
				</html>
			`;
			next();
		});
	return router;
}
