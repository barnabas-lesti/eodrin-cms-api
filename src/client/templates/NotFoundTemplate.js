import React, { Component } from 'react';

export default class NotFoundTemplate extends Component {
	render() {
		return (
			<div className="NotFoundTemplate page container">
				<img src="/assets/images/not-found.jpg" />
				<h1>
					Page not found, sorry...
				</h1>
			</div>
		);
	}
}
