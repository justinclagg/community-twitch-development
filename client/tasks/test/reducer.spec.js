import { expect } from 'chai';
import reducer from '..';
import * as t from '../actionTypes';
import * as factories from './factories';

describe('Task reducer', function () {

    let defaultState;

    beforeEach(function () {
        defaultState = factories.defaultState();
    });

    it('should have a default state', function () {
        expect(
            reducer(undefined, {})
        ).to.deep.equal(
            defaultState
        );
    });

    it('should handle FETCH', function () {
        expect(
            reducer(defaultState, {
                type: t.FETCH
            })
        ).to.deep.equal({
            ...defaultState,
            fetchingTasks: true
        });
    });

    it('should handle FETCH_SUCCESS and update the tasks state', function () {
        const currentTasks = [factories.existingTask()];

        expect(
            reducer(defaultState, {
                type: t.FETCH_SUCCESS,
                payload: currentTasks
            })
        ).to.deep.equal({
            ...defaultState,
            fetchingTasks: false,
            tasks: currentTasks
        });
    });

    it('should handle FETCH_FAILURE', function () {
        const err = new Error();

        expect(
            reducer(defaultState, {
                type: t.FETCH_FAILURE,
                payload: err
            })
        ).to.deep.equal({
            ...defaultState,
            fetchingTasks: false,
            error: err
        });
    });

    it('should handle ADD_SUCCESS and add the given task', function () {

    });

    
    it('should handle ADD_FAILURE', function () {
        
    });

    it('should handle DELETE_SUCCESS and remove task with the given id', function () {
        const initialState = {
            ...defaultState,
            tasks: [{ _id: '1' }, { _id: '2' }]
        };

        expect(
            reducer(initialState, {
                type: t.DELETE_SUCCESS,
                payload: '1'
            })
        ).to.deep.equal(
            {
                ...defaultState,
                tasks: [{ _id: '2' }]
            }
            );
    });

    
    it('should handle DELETE_FAILURE', function () {
        
    });

    
    it('should handle EDIT_SUCCESS and edit the task with the given id', function () {
        
    });
    
    
    it('should handle EDIT_FAILURE', function () {
        
    });
    

});