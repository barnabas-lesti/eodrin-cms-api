import React, { Component } from 'react';
import urlJoin from 'url-join';

export default class Footer extends Component {
	render() {
		const {
			copyrightText,
			menuItems,
			baseHref,
			social,
		} = this.props;
		return (
			<footer className="Footer clearfix">
				<div className="container">
					<ul className="Footer_links">
						{menuItems && menuItems.map((menuItem, index) =>
							<li key={index}>
								<a href={urlJoin(baseHref, menuItem.path)}>{menuItem.label}</a>
							</li>
						)}
					</ul>
					<div className="Footer_social">
						{social && social.map((socialItem, index) =>
							<a
								key={index}
								href={socialItem.url}
								target="_blank">
								<img
									src={socialItem.imageUrl}
									alt={socialItem.label}
								/>
							</a>
						)}
					</div>
					{copyrightText &&
						<p className="Footer_rights">{copyrightText}</p>
					}
				</div>
			</footer>
		);
	}
}
