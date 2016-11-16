import React, { PropTypes, Component } from 'react';

import { TableRow, TableRowColumn } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import { deleteTask, editTask, toggleArchiveTask } from '../taskActions.js';

export default class Task extends Component {

	constructor() {
		super();
		this.state = {
			editMode: false
		};
	}

	handleIconMenu(event) {
		event.stopPropagation(); // Don't open task modal when clicking admin task menu
	}

	toggleEditMode() {
		this.setState({ editMode: !this.state.editMode });
	}

	// Test each key press for tab, enter, escape
	checkTaskEditInput(task, event) {
		let editedTask = {};
		switch (event.keyCode) {
			case 9:
				// tab: Save task edit
				editedTask = this.getEditedTask(task, event);
				this.editTask(editedTask);
				break;
			case 13:
				// enter: Save task edit and leave edit mode
				editedTask = this.getEditedTask(task, event);
				this.editTask(editedTask);
				this.toggleEditMode();
				break;
			case 27:
				// escape: Leave edit mode without save
				this.toggleEditMode();
				break;
		}
	}

	getEditedTask(task, event) {
		if (event.target.name === 'name') {
			return {...task, name: event.target.value };
		}
		else if (event.target.name === 'description') {
			return {...task, description: event.target.value };
		}
	}

	editTask(task) {
		const { dispatch, socket, category } = this.props;			
		dispatch(editTask(category, task, socket));
	}

	toggleArchiveTask(task) {
		const { dispatch, socket } = this.props;	
		dispatch(toggleArchiveTask(task, socket));
	}

	deleteTask(_id) {
		const { dispatch, socket, category } = this.props;
		dispatch(deleteTask(category, _id, socket));
	}

	render() {
		const { task, handleTaskClick, profile, showArchive } = this.props;
		const { editMode } = this.state;

		// Don't show archived tasks when showArchive == false
		if (task.archive && !showArchive) {
			return null;
		}

		// Shorten displayed description if too long
		let taskDescription = task.description;
		if (taskDescription.length > 200) {
			taskDescription = taskDescription.slice(0, 200) + '...';
		}

		let TaskRow;
		const taskClass = task.archive ? 'archived-task table-row' : 'table-row';
		if (editMode) {
			// Admin view, edit mode
			TaskRow = (
				<TableRow className={taskClass} onTouchTap={null}>
					<TableRowColumn className='name-col'>
						<TextField
							name='name'
							defaultValue={task.name}
							onKeyDown={this.checkTaskEditInput.bind(this, task)}
							fullWidth={true}
							autoComplete='off'
							/>
					</TableRowColumn>
					<TableRowColumn className='description-col'>
						<TextField
							name='description'
							defaultValue={taskDescription}
							onKeyDown={this.checkTaskEditInput.bind(this, task)}
							fullWidth={true}
							autoComplete='off'
							autoFocus
							/>
					</TableRowColumn>
					<TableRowColumn className='submission-col'>{task.submissions.length}</TableRowColumn>
					<IconMenu
						iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
						anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
						targetOrigin={{ horizontal: 'right', vertical: 'top' }}
						iconStyle={{ color: '#AAA' }}
						onTouchTap={this.handleIconMenu}
						>
						<MenuItem primaryText='Edit' onTouchTap={this.toggleEditMode.bind(this)} />
						<MenuItem primaryText='Delete' onTouchTap={this.deleteTask.bind(this, task._id)} />
					</IconMenu>
				</TableRow>
			);
		}
		else if (profile.role === 'admin') {
			// Admin view, no edit mode
			TaskRow = (
				<TableRow className={taskClass} onTouchTap={(event) => handleTaskClick(task, event)}>
					<TableRowColumn className='name-col'>{task.name}</TableRowColumn>
					<TableRowColumn className='description-col'>{taskDescription}</TableRowColumn>
					<TableRowColumn className='submission-col'>{task.submissions.length}</TableRowColumn>
					<IconMenu
						iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
						anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
						targetOrigin={{ horizontal: 'right', vertical: 'top' }}
						iconStyle={{ color: '#AAA' }}
						onTouchTap={this.handleIconMenu}
						>
						<MenuItem primaryText='Edit' onTouchTap={this.toggleEditMode.bind(this)} />
						{task.archive ?
							<MenuItem primaryText='Unarchive' onTouchTap={this.toggleArchiveTask.bind(this, task)} /> :
							<MenuItem primaryText='Archive' onTouchTap={this.toggleArchiveTask.bind(this, task)} />
						}
						<MenuItem primaryText='Delete' onTouchTap={this.deleteTask.bind(this, task._id)} />
					</IconMenu>
				</TableRow>
			);
		}
		else {
			// Non-admin view
			TaskRow = (
				<TableRow className={taskClass} onTouchTap={(event) => handleTaskClick(task, event)}>
					<TableRowColumn className='name-col'>{task.name}</TableRowColumn>
					<TableRowColumn className='description-col'>{taskDescription}</TableRowColumn>
					<TableRowColumn className='submission-col'>{task.submissions.length}</TableRowColumn>
				</TableRow>
			);
		}

		return (
			{...TaskRow }
		);
	}
}

Task.propTypes = {
	dispatch: PropTypes.func.isRequired,
	socket: PropTypes.object.isRequired,
	task: PropTypes.object.isRequired,
	category: PropTypes.string.isRequired,
	isAuthenticated: PropTypes.bool.isRequired,
	profile: PropTypes.object.isRequired,
	handleTaskClick: PropTypes.func.isRequired,
	showArchive: PropTypes.bool.isRequired
};