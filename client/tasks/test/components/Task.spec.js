import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import Task from '../../components/Task.jsx';
import * as factories from '../factories';

describe('Task component', function () {

    let wrapper, props;

    function shallowRender() {
        wrapper = shallow(<Task {...props} />);
    }

    beforeEach(function () {
        props = {
            dispatch: factories.dispatch(),
            socket: factories.socket(),
            task: factories.existingTask(),
            category: factories.category,
            isAuthenticated: false,
            profile: factories.profile(),
            handleTaskClick: () => { },
            showArchive: false
        };
        shallowRender();
    });


    it('renders non-admin view', function () {
        const TableRow = wrapper.find('TableRow');
        const TableRowColumns = wrapper.find('TableRowColumn');

        expect(TableRow).to.have.length(1);
        expect(TableRowColumns).to.have.length(3);

        expect(TableRowColumns.at(0).hasClass('name-col')).to.be.true;
        expect(TableRowColumns.at(0).contains(props.task.name)).to.be.true;

        expect(TableRowColumns.at(1).hasClass('description-col')).to.be.true;
        expect(TableRowColumns.at(1).contains(props.task.description)).to.be.true;

        expect(TableRowColumns.at(2).hasClass('submission-col')).to.be.true;
        expect(TableRowColumns.at(2).contains(props.task.submissions.length)).to.be.true;
    });

    it('renders admin view', function () {
        props.profile.role = 'admin';
        shallowRender();
        const TableRow = wrapper.find('TableRow');
        const TableRowColumns = wrapper.find('TableRowColumn');
        const IconMenu = wrapper.find('IconMenu');
        const MenuItems = IconMenu.find('MenuItem');

        expect(TableRow).to.have.length(1);
        expect(TableRowColumns).to.have.length(3);
        expect(IconMenu).to.have.length(1);

        expect(TableRowColumns.at(0).hasClass('name-col')).to.be.true;
        expect(TableRowColumns.at(0).contains(props.task.name)).to.be.true;

        expect(TableRowColumns.at(1).hasClass('description-col')).to.be.true;
        expect(TableRowColumns.at(1).contains(props.task.description)).to.be.true;

        expect(TableRowColumns.at(2).hasClass('submission-col')).to.be.true;
        expect(TableRowColumns.at(2).contains(props.task.submissions.length)).to.be.true;

        expect(MenuItems).to.have.length(3);
        expect(MenuItems.at(0).prop('primaryText')).to.equal('Edit');
        expect(MenuItems.at(2).prop('primaryText')).to.equal('Delete');
    });

    it('archived tasks should not render if showArchive is false', function () {
        props.showArchive = false;
        props.task.archive = true;
        shallowRender();

        expect(wrapper.children()).to.have.length(0);
    });

    
    it('shown archived tasks should have an archived-task class', function () {
        props.showArchive = true;

        // Archived task
        props.task.archive = true;
        shallowRender();
        let TableRow = wrapper.find('TableRow');

        expect(TableRow.at(0).hasClass('archived-task table-row')).to.be.true;

        // Unarchived task
        props.task.archive = false;
        shallowRender();
        TableRow = wrapper.find('TableRow');        

        expect(TableRow.at(0).hasClass('table-row')).to.be.true;
        expect(TableRow.at(0).hasClass('archived-task')).to.be.false;
    });
    

    it('admin menu should have Archive or Unarchive options', function () {
        props.profile.role = 'admin';
        props.showArchive = true;

        // Archived task
        props.task.archive = true;
        shallowRender();
        let MenuItems = wrapper.find('MenuItem');

        expect(MenuItems.at(1).prop('primaryText')).to.equal('Unarchive');        

        // Unarchived task
        props.task.archive = false;
        shallowRender();
        MenuItems = wrapper.find('MenuItem');

        expect(MenuItems.at(1).prop('primaryText')).to.equal('Archive');        
    });


    it('toggleEditing() toggles the editing state', function () {
        const initialState = wrapper.state('editing');

        wrapper.instance().toggleEditing();
        const currentState = wrapper.state('editing');

        expect(currentState).to.equal(!initialState);
    });


    it('getEditedTask() should update the name or description based on the event source', function () {
        const task = factories.existingTask();
        const event = factories.keyEvent();

        // Edit name
        event.target.name = 'name';
        event.target.value = 'edited name';

        let editedTask = wrapper.instance().getEditedTask(task, event);

        expect(editedTask).to.deep.equal({
            ...task,
            name: event.target.value
        });

        // Edit description
        event.target.name = 'description';
        event.target.value = 'edited description';

        editedTask = wrapper.instance().getEditedTask(task, event);

        expect(editedTask).to.deep.equal({
            ...task,
            description: event.target.value
        });
    });




});