import React, { PropTypes } from 'react';

import { Table, TableBody, TableHeaderColumn, TableRow } from 'material-ui/Table';
import Toggle from 'material-ui/Toggle';
import CategoryDropdown from './CategoryDropdown.jsx';
import Task from './Task.jsx';

export default class TaskTable extends React.Component {

	constructor() {
		super();
		this.state = {
			showArchive: false
		};
	}

	toggleShowArchive() {
		this.setState({ showArchive: !this.state.showArchive });
	}

	render() {
		const { tasks, category, categories, isAuthenticated, profile, handleTaskClick, dispatch, socket } = this.props;
		const { showArchive } = this.state;

		// Generate task rows with newest tasks first
		let taskList = [];
		for (let i = tasks.length - 1; i >= 0; i--) {
			taskList.push(
				<Task
					task={tasks[i]}
					category={category}
					showArchive={showArchive}
					handleTaskClick={handleTaskClick}
					isAuthenticated={isAuthenticated}
					profile={profile}
					dispatch={dispatch}
					socket={socket}
					key={i}
					/>
			);
		}

		return (
			<Table className="task-table" selectable={false}>
				<TableBody displayRowCheckbox={false} showRowHover={true}>
					<TableRow className="table-super">
						<TableHeaderColumn>
							<CategoryDropdown category={category} categories={categories} />
						</TableHeaderColumn>
						<TableHeaderColumn className="mobile-hidden"></TableHeaderColumn>
						<TableHeaderColumn>
							<Toggle
								label="Archive"
								onToggle={this.toggleShowArchive.bind(this)}
								labelStyle={{ fontSize: '14px', fontWeight: 'normal' }}
								labelPosition="left"
								style={{ marginTop: '20px', maxWidth: '100px' }}
								/>
						</TableHeaderColumn>
					</TableRow>
					<TableRow className="table-header">
						<TableHeaderColumn className="name-col">Name</TableHeaderColumn>
						<TableHeaderColumn className="description-col">Description</TableHeaderColumn>
						<TableHeaderColumn className="submission-col">Submissions</TableHeaderColumn>
					</TableRow>
					{taskList}
				</TableBody>
			</Table>
		);
	}
}

TaskTable.propTypes = {
	tasks: PropTypes.array.isRequired,
	category: PropTypes.string.isRequired,
	categories: PropTypes.array.isRequired,
	handleTaskClick: PropTypes.func.isRequired,
	dispatch: PropTypes.func.isRequired,
	socket: PropTypes.object.isRequired,
	isAuthenticated: PropTypes.bool.isRequired,
	profile: PropTypes.object.isRequired
};