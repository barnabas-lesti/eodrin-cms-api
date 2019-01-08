import React, { Component } from 'react';

import PostCard from './PostCard';

export default class Listing extends Component {
	render() {
		const {
			items,
			baseHref,
		} = this.props;
		return (
			<div className="Listing">
				{items && items.map((item, index) =>
					<PostCard
						key={index}
						description={item.description}
						title={item.title}
						path={item.pagePath}
						baseHref={baseHref}
					/>
				)}
			</div>
		);
	}
}
