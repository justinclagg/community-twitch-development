import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import * as factories from '../factories';
import AddTaskForm from '../../components/AddTaskForm.jsx';
import * as actions from '../../actions';

describe('AddTaskForm', function () {

    let wrapper, props;

    function shallowRender() {
        wrapper = shallow(<AddTaskForm {...props} />);
    }

    beforeEach(function () {
        props = {
            category: factories.category,
            socket: factories.socket(),
            dispatch: factories.dispatch()
        };
        shallowRender();
    });

    it('should render a form with inputs', function () {
        expect(wrapper.find('form')).to.have.length(1);
        expect(wrapper.find('input')).to.have.length(3);
        expect(
            wrapper.find('input').at(2).hasClass('hide-btn')
        ).to.be.true;
    });

    it('should call onSubmit() when a submission to the form is made', sinon.test(function () {
        const onSubmit = this.stub(AddTaskForm.prototype, 'onSubmit');
        shallowRender();

        wrapper.find('form').simulate('submit');

        expect(onSubmit).to.be.calledOnce;
    }));


    it('onSubmit() should prevent page refresh', sinon.test(function () {
        const event = factories.submissionEvent();
        event.target = { name: {}, description: {} };
        const preventDefault = this.spy(event, 'preventDefault');

        wrapper.instance().onSubmit(event);

        expect(preventDefault).to.be.calledOnce;
    }));


    it('onSubmit() should call dispatchAddTask() only if a name is present', sinon.test(function () {
        // Call onSubmit() with a name value
        const event = factories.submissionEvent();
        event.target = {
            name: {
                value: 'name',
                focus: () => { }
            },
            description: {
                value: ''
            }
        };
        let dispatchAddTask = this.stub(AddTaskForm.prototype, 'dispatchAddTask');
        shallowRender();

        wrapper.instance().onSubmit(event);

        expect(dispatchAddTask)
            .to.be.calledOnce
            .calledWithExactly('name', '');
        
        dispatchAddTask.restore();

        // Call onSubmit() without a name value
        event.target.name.value = '';
        event.target.description.value = 'description';
        dispatchAddTask = this.stub(AddTaskForm.prototype, 'dispatchAddTask');
        shallowRender();

        wrapper.instance().onSubmit(event);

        expect(dispatchAddTask)
            .to.not.be.called;
    }));

    it('onSubmit() should clear the name and description input, and call name.focus()', sinon.test(function () {
        const event = factories.submissionEvent();
        event.target = {
            name: {
                value: 'name',
                focus: this.spy()
            },
            description: {
                value: 'description'
            }
        };
        const { focus } = event.target.name;

        wrapper.instance().onSubmit(event);

        expect(event.target.name.value).to.equal('');
        expect(event.target.description.value).to.equal('');
        expect(focus).to.be.calledOnce;
    }));

    it('dispatchAddTask() should dispatch addTask', sinon.test(function () {
        const addTask = this.stub(actions, 'addTask');
        const dispatch = this.stub(props, 'dispatch');
        shallowRender();

        wrapper.instance().dispatchAddTask('name', 'description');

        expect(addTask)
            .to.be.calledOnce
            .calledWithExactly(props.category, 'name', 'description', props.socket);

        expect(dispatch)
            .to.be.calledOnce
            .calledWithExactly(addTask());
    }));

});