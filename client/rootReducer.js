import { combineReducers } from 'redux';
import taskReducer from './tasks/taskReducer.js';
import userReducer from './users/userReducer.js';

export default combineReducers({
	taskReducer,
	userReducer
});