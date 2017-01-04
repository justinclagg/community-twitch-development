import 'isomorphic-fetch';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import * as t from '../../client/tasks/actionTypes';
import * as a from '../../client/tasks/actions';
import fetchMock from 'fetch-mock';

const mockStore = configureMockStore([promise(), thunk]);

describe('Task actions', function () {

	afterEach(function () {
		fetchMock.restore();
	});

	describe('fetchTasks()', function () {
		it('creates FETCH_SUCCESS when tasks for a category are received', function () {
			const category = 'Test Category';
			const categoryURI = encodeURIComponent(category);
			const tasks = [{
				category: category,
				name: 'name',
				description: 'description',
				claims: [],
				submissions: [],
				archive: false
			}];

			fetchMock.get(`/live/tasks/${categoryURI}`, tasks);

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

	const socket = { emit: function () { } };

	describe('addTask()', function () {
		it('sends a new task and creates ADD_SUCCESS', function () {
			const category = 'Test Category';
			const task = {
				category,
				name: 'name',
				description: 'description',
				claims: [],
				submissions: [],
				archive: false
			};
			const taskWithId = { ...task, _id: 1 };

			fetchMock.post(`/live/tasks/${category}`, taskWithId);

			const expected = [{ type: t.ADD_SUCCESS, payload: taskWithId }];

			const store = mockStore({});
			return store.dispatch(a.addTask(category, task.name, task.description, socket))
				.then(() => {
					expect(store.getActions()).to.deep.equal(expected);
				});
		});
	});

	describe('deleteTask()', function () {
		it('sends id of task to be deleted and creates DELETE_SUCCESS', function () {
			const category = 'Test Category';
			const _id = '1';

			fetchMock.delete(`/live/tasks/${category}`, 201);

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
			const category = 'Test Category';
			const task = {
				_id: '1',
				name: 'name',
				description: 'description'
			};

			fetchMock.put(`/live/tasks/${category}`, 201);

			const expected = [{ type: t.EDIT_SUCCESS, payload: task }];

			const store = mockStore({});
			return store.dispatch(a.editTask(category, task, socket))
				.then(() => {
					expect(store.getActions()).to.deep.equal(expected);
				});
		});
	});

















});