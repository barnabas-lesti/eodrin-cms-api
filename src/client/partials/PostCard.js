import React, { Component } from 'react';
import urlJoin from 'url-join';

export default class PostCard extends Component {
	render() {
		const {
			description,
			title,
			path,
			baseHref,
		} = this.props;
		const href = urlJoin(baseHref, path);
		return (
			<a className="PostCard" href={href}>
				<h2 className="PostCard_title">{title}</h2>
				<p className="PostCard_description">{description}</p>
				<span className="PostCard_cta">Check out the posts</span>
			</a>
		);
	}
}
