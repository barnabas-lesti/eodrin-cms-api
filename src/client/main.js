import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import initialData from './initialData';

ReactDOM.hydrate(<App template={initialData.template} />, document.getElementById('app'));
