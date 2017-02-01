import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import * as t from '../actionTypes';
import * as a from '../actions';
import * as factories from './factories';
import fetchMock from 'fetch-mock';

describe('Task actions', function () {

    const mockStore = configureMockStore([promise(), thunk]);
    const { category } = factories;
    const taskRoute = `/task/${category}`;
    const taskRouteEncoded = `/task/${encodeURIComponent(category)}`;

    let newTask, existingTask, socket;

    beforeEach(function() {
        newTask = factories.newTask();
        existingTask = factories.existingTask();
        socket = factories.socket();
    });

    afterEach(function () {
        fetchMock.restore();
    });

    describe('fetchTasks()', function () {

        it('creates FETCH_SUCCESS when tasks for a category are received', function () {
            const tasks = [existingTask];
            const expected = [
                { type: t.FETCH },
                { type: t.FETCH_SUCCESS, payload: tasks }
            ];
            const store = mockStore({ tasks: [] });
            fetchMock.get(taskRouteEncoded, tasks);

            return store.dispatch(a.fetchTasks(category))
                .then(() => {
                    expect(fetchMock.called(taskRouteEncoded)).to.be.true;
                    expect(store.getActions()).to.deep.equal(expected);
                });
        });

        it('creates FETCH_FAILURE if fetch is not successful', function () {
            const err = new Error();
            const expected = [
                { type: t.FETCH },
                { type: t.FETCH_FAILURE, payload: err }
            ];
            const store = mockStore({ tasks: [] });
            fetchMock.get(taskRouteEncoded, { throws: err });

            return store.dispatch(a.fetchTasks(category))
                .then(() => {
                    expect(store.getActions()).to.deep.equal(expected);
                });
        });
    });

    describe('clearTasks()', function () {

        it('should create an action to clear the task array', function () {
            const expected = { type: t.CLEAR };
            a.clearTasks().should.deep.equal(expected);
        });
    });


    describe('addTask()', function () {

        it('sends a new task and creates ADD_SUCCESS', function () {
            const expected = [{ type: t.ADD_SUCCESS, payload: existingTask }];
            const store = mockStore({});
            fetchMock.post(taskRoute, existingTask);

            return store.dispatch(a.addTask(category, newTask.name, newTask.description, socket))
                .then(() => {
                    expect(store.getActions()).to.deep.equal(expected);
                });
        });

        it('creates ADD_FAILURE if post is not successful', function () {
            const err = new Error();
            const expected = [{ type: t.ADD_FAILURE, payload: err }];
            const store = mockStore({});
            fetchMock.post(taskRoute, { throws: err });

            return store.dispatch(a.addTask(category, newTask.name, newTask.description, socket))
                .then(() => {
                    expect(store.getActions()).to.deep.equal(expected);
                });
        });
    });

    describe('deleteTask()', function () {

        it('sends id of task to be deleted and creates DELETE_SUCCESS', function () {
            const { _id } = existingTask;
            const expected = [{ type: t.DELETE_SUCCESS, payload: _id }];
            const store = mockStore({});
            fetchMock.delete(taskRoute, 201);

            return store.dispatch(a.deleteTask(category, _id, socket))
                .then(() => {
                    expect(store.getActions()).to.deep.equal(expected);
                });
        });

        it('creates DELETE_FAILURE if delete is not successful', function () {
            const { _id } = existingTask;
            const err = new Error();
            const expected = [{ type: t.DELETE_FAILURE, payload: err }];
            const store = mockStore({});
            fetchMock.delete(taskRoute, { throws: err });

            return store.dispatch(a.deleteTask(category, _id, socket))
                .then(() => {
                    expect(store.getActions()).to.deep.equal(expected);
                });
        });
    });

    describe('editTask()', function () {

        it('sends a task with updated name/description and creates EDIT_SUCCESS', function () {
            const { _id, name, description } = existingTask;
            const payload = { _id, name, description };
            const expected = [{ type: t.EDIT_SUCCESS, payload }];
            const store = mockStore({});
            fetchMock.put(taskRoute, 201);

            return store.dispatch(a.editTask(category, existingTask, socket))
                .then(() => {
                    expect(store.getActions()).to.deep.equal(expected);
                });
        });

        it('creates EDIT_FAILURE of edit is not successful', function () {
            const err = new Error();
            const expected = [{ type: t.EDIT_FAILURE, payload: err }];
            const store = mockStore({});
            fetchMock.put(taskRoute, { throws: err });

            return store.dispatch(a.editTask(category, existingTask, socket))
                .then(() => {
                    expect(store.getActions()).to.deep.equal(expected);
                });
        });
    });

});