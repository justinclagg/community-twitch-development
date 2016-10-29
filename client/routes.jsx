import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App.jsx';
import TaskPage from './tasks/pages/TaskPage.jsx';
import ContributePage from './tasks/pages/ContributePage.jsx';
import ProfilePage from './users/pages/ProfilePage.jsx';
import AdminPage from './users/pages/AdminPage.jsx';

export default (
	<Route path={'/'} component={App}>
		<IndexRoute component={ContributePage} />
		<Route path="contribute/:category" component={TaskPage} />		
		<Route path="profile" component={ProfilePage} />
		<Route path="admin" component={AdminPage} />
	</Route>
);