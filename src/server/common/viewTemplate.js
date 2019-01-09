import React from 'react';
import { renderToString } from 'react-dom/server';

import contentService from '../services/contentService';

import App from '../../client/App';

export default async function viewTemplate (pagePromise) {
	const [ page, settings ] = await Promise.all([
		pagePromise,
		contentService.getSettings(),
	]);

	const initialData = {
		page,
		settings,
	};
	const content = renderToString(
		<App initialData={initialData} />
	);

	let meta;
	if (page !== null) {
		const { title, description, keywords } = page;
		meta = {
			title,
			description,
			keywords,
		};
	} else {
		meta = {
			title: 'Page not found'
		};
	}

	return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1">
				${meta.description ? '<meta name="description" content="' + meta.description + '">' : ''}
				${meta.keywords ? '<meta name="keywords" content="' + meta.keywords.join(', ') + '">' : ''}
				<title>${meta.title}</title>

				<link rel="icon" href="/assets/favicon.ico" type="image/x-icon">
				<link rel="stylesheet" type="text/css" href="/assets/client.css">

				<base href="${settings.baseHref}">

				<script src="/assets/client.js" defer></script>
				<script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};</script>
			</head>
			<body>
				<div id="app">${content}</div>
			</body>
		</html>
	`;
}