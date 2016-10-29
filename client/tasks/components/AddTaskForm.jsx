import React, { Component, PropTypes } from 'react';
import { addTask } from '../taskActions.js';

export default class AddTaskForm extends Component {

	// Submits new task and clears form
	handleTaskSubmit(event) {
		event.preventDefault(); // Prevent page refresh
		const { name, description } = event.target;

		if (name.value || description.value) {
			this.addTask(name.value, description.value);
			name.value = '';
			description.value = '';
			name.focus();
		}
	}

	addTask(name, description) {
		const { dispatch, socket } = this.props;
		dispatch(addTask(this.props.category, name, description, socket));
	}

	render() {
		return (
			<form className="admin-task-form" onSubmit={this.handleTaskSubmit.bind(this)} autoComplete="off">
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