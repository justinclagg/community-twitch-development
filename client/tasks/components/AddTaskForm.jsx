import React, { Component, PropTypes } from 'react';
import { addTask } from '../actions';

class AddTaskForm extends Component {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.addTask = (category, name, description) => props.dispatch(addTask(category, name, description, props.socket));
    }

    // Submits new task and clears form
    onSubmit(event) {
        event.preventDefault(); // Prevent page refresh
        const { name, description } = event.target;

        if (name.value || description.value) {
            this.addTask(this.props.category, name.value, description.value);
            name.value = '';
            description.value = '';
            name.focus();
        }
    }

    render() {
        return (
            <form className="admin-task-form" onSubmit={this.onSubmit} autoComplete="off">
                <input type="text" name="name" placeholder="Name" id="test" autoFocus />
                <input type="text" name="description" placeholder="Description" />
                <input className="hide-btn" type="submit" />
            </form>
        );
    }
}

AddTaskForm.propTypes = {
    dispatch: PropTypes.func.isRequired,
    socket: PropTypes.object.isRequired,
    category: PropTypes.string.isRequired
};

export default AddTaskForm;