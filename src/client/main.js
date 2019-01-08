import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

ReactDOM.hydrate(
	<App initialData={window.__INITIAL_DATA__} />,
	document.getElementById('app'),
);
