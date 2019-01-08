import React, { Component } from 'react';

import Listing from '../partials/Listing';

export default class BasicTemplate extends Component {
	render() {
		const {
			content,
			baseHref,
			subPages,
		} = this.props;
		return (
			<div className="BasicTemplate page container">
				<div className="BasicTemplate_content" dangerouslySetInnerHTML={{ __html: content }}></div>
				{subPages &&
					<Listing items={subPages} baseHref={baseHref} />
				}
			</div>
		);
	}
}
