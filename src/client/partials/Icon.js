import React, { Component } from 'react';
import classNames from 'classnames';

export const Icons = {
	CLOSE: 'fas fa-times',
	BURGER: 'fas fa-bars',
};

export default class Icon extends Component {
	render() {
		const { icon } = this.props;
		return (
			<i className={classNames(
				'Icon',
				icon,
			)}></i>
		);
	}
}
