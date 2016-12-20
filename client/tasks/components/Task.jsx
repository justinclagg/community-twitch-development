import React, { PropTypes, Component } from 'react';

import { TableRow, TableRowColumn } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import { deleteTask, editTask, toggleArchive } from '../actions';

class Task extends Component {

	constructor(props) {
		super(props);
		this.state = {
			editing: false
		};
		this.onIconMenuClick = this.onIconMenuClick.bind(this);
		this.toggleEditing = this.toggleEditing.bind(this);
		this.editTask = (category, task) => props.dispatch(editTask(category, task, props.socket));
		this.toggleArchive = (task) => props.dispatch(toggleArchive(task, props.socket));
		this.deleteTask = (category, _id) => props.dispatch(deleteTask(category, _id, props.socket));
	}

	onIconMenuClick(event) {
		event.stopPropagation(); // Don't open task modal when clicking admin task menu
	}

	toggleEditing() {
		this.setState((prevState) => {
			return { editing: !prevState.editing };
		});
	}

	// Test each key press for tab, enter, escape
	onEditInput(task, event) {
		let editedTask = {};
		switch (event.keyCode) {
			case 9:
				// tab: Save task edit
				editedTask = this.getEditedTask(task, event);
				this.editTask(this.props.category, editedTask);
				break;
			case 13:
				// enter: Save task edit and leave edit mode
				editedTask = this.getEditedTask(task, event);
				this.editTask(this.props.category, editedTask);
				this.toggleEditing();
				break;
			case 27:
				// escape: Leave edit mode without save
				this.toggleEditing();
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

	render() {
		const { task, handleTaskClick, profile, showArchive } = this.props;
		const { editing } = this.state;

		// Don't show archived tasks when showArchive == false
		if (task.archive && !showArchive) {
			return null;
		}

		// Shorten displayed description if too long
		let taskDescription = task.description;
		if (taskDescription.length > 200) {
			taskDescription = taskDescription.slice(0, 200) + '...';
		}

		const taskClass = task.archive ? 'archived-task table-row' : 'table-row';
		let TaskRow;
		if (profile.role !== 'admin') {
			// Non-admin view
			TaskRow = (
				<TableRow className={taskClass} onTouchTap={(event) => handleTaskClick(task, event)}>
					<TableRowColumn className='name-col'>{task.name}</TableRowColumn>
					<TableRowColumn className='description-col'>{taskDescription}</TableRowColumn>
					<TableRowColumn className='submission-col'>{task.submissions.length}</TableRowColumn>
				</TableRow>
			);
		}
		else {
			// Admin view
			TaskRow = (
				<TableRow className={taskClass} onTouchTap={!editing ? (event) => handleTaskClick(task, event) : null}>
					<TableRowColumn className='name-col'>
						{!editing ?
							task.name :
							<TextField
								name='name'
								defaultValue={task.name}
								onKeyDown={(event) => this.onEditInput(task, event)}
								fullWidth={true}
								autoComplete='off'
								/>
						}
					</TableRowColumn>
					<TableRowColumn className='description-col'>
						{!editing ?
							taskDescription :
							<TextField
								name='description'
								defaultValue={taskDescription}
								onKeyDown={(event) => this.onEditInput(task, event)}
								fullWidth={true}
								autoComplete='off'
								autoFocus
								/>
						}
					</TableRowColumn>
					<TableRowColumn className='submission-col'>{task.submissions.length}</TableRowColumn>
					<IconMenu
						iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
						anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
						targetOrigin={{ horizontal: 'right', vertical: 'top' }}
						iconStyle={{ color: '#AAA' }}
						onTouchTap={this.onIconMenuClick}
						>
						<MenuItem primaryText='Edit' onTouchTap={this.toggleEditing} />
						{task.archive ?
							<MenuItem primaryText='Unarchive' onTouchTap={() => this.toggleArchive(task)} /> :
							<MenuItem primaryText='Archive' onTouchTap={() => this.toggleArchive(task)} />
						}
						<MenuItem primaryText='Delete' onTouchTap={() => this.deleteTask(this.props.category, task._id)} />
					</IconMenu>
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

export default Task;