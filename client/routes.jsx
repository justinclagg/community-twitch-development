import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App.jsx';
import { TaskPage } from './tasks';
import { CategoryPage } from './categories';
import { AdminPage, ProfilePage } from './users';

export default (
    <Route path={'/'} component={App}>
        <IndexRoute component={CategoryPage} />
        <Route path="contribute/:category" component={TaskPage} />
        <Route path="profile" component={ProfilePage} />
        <Route path="admin" component={AdminPage} />
    </Route>
);