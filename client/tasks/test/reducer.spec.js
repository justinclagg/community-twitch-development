import { expect } from 'chai';
import reducer from '..';
import * as t from '../actionTypes';

describe('Task reducer', function () {
    const initialState = {
        tasks: [],
        submissions: [],
        fetchingTasks: false,
        fetchingSubmissions: false,
        error: null
    };

    it('should default to initial state', function () {
        expect(reducer(undefined, {})).to.deep.equal(initialState);
    });

    it('should handle FETCH', function () {
        expect(
            reducer(undefined, {
                type: t.FETCH
            })
        ).to.deep.equal(
            {
                ...initialState,
                fetchingTasks: true
            }
            );
    });

    it('should handle DELETE_SUCCESS and remove task with the given id', function () {
        const initial = {
            ...initialState,
            tasks: [{ _id: '1' }, { _id: '2' }]
        };
        expect(
            reducer(initial, {
                type: t.DELETE_SUCCESS,
                payload: '1'
            })
        ).to.deep.equal(
            {
                ...initialState,
                tasks: [{ _id: '2' }]
            }
            );
    });



});