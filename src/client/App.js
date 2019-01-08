import React, { Component } from 'react';

import templates from './templates';

export default class App extends Component {
	render() {
		const { template } = this.props;
		console.log(template);
		const Template = templates[template];
		return (
			<div className="App">
				<Template />
			</div>
		);
	}
}
