import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import injectTapEventPlugin from 'react-tap-event-plugin';

import rootReducer from './rootReducer.js';
import routes from './routes.jsx';

require('es6-promise').polyfill(); // Promise polyfill
require('isomorphic-fetch');

injectTapEventPlugin(); // Needed for material-ui onTouchTap

require('./css/main.scss');

// Apply middleware
let middleware;
if (process.env.NODE_ENV === 'production') {
	middleware = applyMiddleware(promise(), thunk);
}
else {
	const logger = require('redux-logger');
	middleware = applyMiddleware(logger(), promise(), thunk);
}

const store = createStore(rootReducer, middleware);
const rootElement = document.getElementById('app');

render(
	<Provider store={store}>
		<Router history={browserHistory} routes={routes} />
	</Provider>
	, rootElement
);