import { combineReducers } from 'redux';
import tasks from './tasks';
import categories from './categories';
import users from './users';

export default combineReducers({
	tasks,
	categories,
	users
});