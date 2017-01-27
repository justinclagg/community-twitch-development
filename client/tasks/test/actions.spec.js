import 'isomorphic-fetch';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import * as t from '../actionTypes';
import * as a from '../actions';
import fetchMock from 'fetch-mock';

const mockStore = configureMockStore([promise(), thunk]);

describe('Task actions', function () {
	const newTask = {
		category: 'Test Category',
		name: 'name',
		description: 'description',
		claims: [],
		submissions: [],
		archive: false
	};
	const existingTask = { ...newTask, _id: '1' };
	const { category } = existingTask;
	const taskRoute = `/task/${category}`;
	const socket = { emit: function () { } };

	afterEach(function () {
		fetchMock.restore();
	});

	describe('fetchTasks()', function () {
		it('creates FETCH_SUCCESS when tasks for a category are received', function () {
			const categoryURI = encodeURIComponent(category);
			const tasks = [existingTask];

			fetchMock.get(`/task/${categoryURI}`, tasks);

			const expected = [
				{ type: t.FETCH },
				{ type: t.FETCH_SUCCESS, payload: tasks }
			];

			const store = mockStore({ tasks: [] });
			return store.dispatch(a.fetchTasks(category))
				.then(() => {
					expect(store.getActions()).to.deep.equal(expected);
				});
		});
	});

	describe('clearTasks()', function () {
		it('should create an action to clear the task array', function () {
			const expected = { type: t.CLEAR };
			expect(a.clearTasks()).to.deep.equal(expected);
		});
	});


	describe('addTask()', function () {
		it('sends a new task and creates ADD_SUCCESS', function () {
			fetchMock.post(taskRoute, existingTask);
			const expected = [{ type: t.ADD_SUCCESS, payload: existingTask }];
			const store = mockStore({});
			return store.dispatch(a.addTask(category, newTask.name, newTask.description, socket))
				.then(() => {
					expect(store.getActions()).to.deep.equal(expected);
				});
		});
	});

	describe('deleteTask()', function () {
		it('sends id of task to be deleted and creates DELETE_SUCCESS', function () {
			const { _id } = existingTask;
			fetchMock.delete(taskRoute, 201);
			const expected = [{ type: t.DELETE_SUCCESS, payload: _id }];
			const store = mockStore({});
			return store.dispatch(a.deleteTask(category, _id, socket))
				.then(() => {
					expect(store.getActions()).to.deep.equal(expected);
				});
		});
	});

	describe('editTask()', function () {
		it('sends a task with updated name/description and creates EDIT_SUCCESS', function () {
			const payload = {
				_id: existingTask._id,
				name: existingTask.name,
				description: existingTask.description
			};
			fetchMock.put(taskRoute, 201);
			const expected = [{ type: t.EDIT_SUCCESS, payload }];
			const store = mockStore({});
			return store.dispatch(a.editTask(category, existingTask, socket))
				.then(() => {
					expect(store.getActions()).to.deep.equal(expected);
				});
		});
	});

















});