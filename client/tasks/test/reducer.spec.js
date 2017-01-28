import chai from 'chai';
import reducer from '..';
import * as t from '../actionTypes';
chai.should();

describe('Task reducer', function () {
    const initialState = {
        tasks: [],
        submissions: [],
        fetchingTasks: false,
        fetchingSubmissions: false,
        error: null
    };

    it('should default to initial state', function () {
        reducer(undefined, {}).should.deep.equal(initialState);
    });

    it('should handle FETCH', function () {
        reducer(undefined, { type: t.FETCH })
            .should.deep.equal({ ...initialState, fetchingTasks: true });
    });

    it('should handle DELETE_SUCCESS and remove task with the given id', function () {
        const initial = {
            ...initialState,
            tasks: [{ _id: '1' }, { _id: '2' }]
        };
        reducer(initial, { type: t.DELETE_SUCCESS, payload: '1' })
            .should.deep.equal({ ...initialState, tasks: [{ _id: '2' }] });
    });



});