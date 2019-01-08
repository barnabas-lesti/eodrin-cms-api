import React, { Component } from 'react';
import urlJoin from 'url-join';

import Icon, { Icons } from './Icon';

export default class Header extends Component {
	render() {
		const {
			menuItems,
			baseHref,
			siteLogoUrl,
		} = this.props;
		return (
			<header className="Header">
				{siteLogoUrl &&
					<a className="Header_logo" href={urlJoin(baseHref)}>
						<img src={siteLogoUrl} alt="Site logo" />
					</a>
				}
				<div className="Header_icon Header_icon-burger">
					<Icon icon={Icons.BURGER} />
				</div>
				<div className="Header_icon Header_icon-close hiddenSm">
					<Icon icon={Icons.CLOSE} />
				</div>

				<ul className="Header_links hiddenSm">
					{menuItems && menuItems.map((menuItem, index) =>
						<li key={index}>
							<a href={urlJoin(baseHref, menuItem.path)}>{menuItem.label}</a>
						</li>
					)}
				</ul>
			</header>
		);
	}
}
