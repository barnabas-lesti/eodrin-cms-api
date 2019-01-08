import React, { Component } from 'react';
import marked from 'marked';

import templates from './templates';

import Footer from './partials/Footer';
import Header from './partials/Header';

export default class App extends Component {
	render() {
		const { initialData } = this.props;
		const {
			page,
			settings,
		} = initialData;

		const {
			copyrightText,
			menuItems,
			baseHref,
			siteLogoUrl,
			social,
		} = settings;

		let Template;
		let templateProps;
		if (page !== null) {
			Template = templates[page.pageTemplate];
			templateProps = {
				content: marked(page.content),
				subPages: page.subPages,
			};
		} else {
			Template = templates['NotFoundTemplate'];
			templateProps = {};
		}

		return (
			<div className="App">
				<Header
					menuItems={menuItems}
					siteLogoUrl={siteLogoUrl}
					baseHref={baseHref}
				/>
				<Template
					baseHref={baseHref}
					{...templateProps}
				/>
				<Footer
					copyrightText={copyrightText}
					menuItems={menuItems}
					social={social}
					baseHref={baseHref}
				/>
			</div>
		);
	}
}
