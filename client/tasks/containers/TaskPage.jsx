import React from 'react';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { TaskTable, AddTaskForm, TaskModal } from '..';
import { LoadingSpinner } from '../../shared';

import { fetchTasks, clearTasks } from '../actions';
import { fetchCategories } from '../../categories';

function mapStateToProps(store) {
	return {
		tasks: store.tasks.tasks,
		categories: store.categories.categories,
		fetchingTasks: store.tasks.fetchingTasks
	};
}

class TaskPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			selectedTask: {}
		};
		this.fetchTasks = (category) => props.dispatch(fetchTasks(category));
		this.clearTasks = () => props.dispatch(clearTasks());
		this.fetchCategories = () => props.dispatch(fetchCategories());
	}

	componentWillMount() {
		this.fetchTasks(this.props.params.category);
		this.fetchCategories();
	}

	componentDidMount() {
		const { socket } = this.props;
		socket.on('tasks', () => this.fetchTasks(this.props.params.category));
		socket.on('categories', () => this.fetchCategories());
		socket.on('task modal', (task) => this.setSelectedTask(task));
		socket.on('submissions', (task) => this.setSelectedTask(task));
	}

	// Update tasks if the URL changes to a different category
	componentDidUpdate(prevProps) {
		if (prevProps.params.category !== this.props.params.category) {
			this.fetchTasks(this.props.params.category);
		}
	}

	componentWillUnmount() {
		this.clearTasks();
	}

	handleTaskClick(task, event) {
		event.preventDefault(); // Prevents double click on mobile
		this.setSelectedTask(task);
		this.TaskModal.toggleModal();
	}

	// Sets the task currently being viewed to pass information to TaskModal
	setSelectedTask(task) {
		this.setState({ selectedTask: task });
	}

	render() {
		const { dispatch, tasks, categories, isAuthenticated, profile, fetchingTasks, socket } = this.props;
		const { selectedTask } = this.state;

		return (
			<div className="task-page">
				{profile.role === 'admin' &&
					<AddTaskForm
						dispatch={dispatch}
						socket={socket}
						category={this.props.params.category}
						/>
				}
				<TaskTable
					dispatch={dispatch}
					socket={socket}
					handleTaskClick={this.handleTaskClick.bind(this) }
					profile={profile}
					tasks={tasks}
					category={this.props.params.category}
					categories={categories}
					isAuthenticated={isAuthenticated}
					/>
				{fetchingTasks &&
					<LoadingSpinner />
				}
				<TaskModal
					ref={ref => this.TaskModal = ref}
					dispatch={dispatch}
					socket={socket}
					task={selectedTask}
					category={this.props.params.category}
					profile={profile}
					isAuthenticated={isAuthenticated}
					setSelectedTask={this.setSelectedTask.bind(this)}
					/>
			</div>
		);
	}
}

TaskPage.propTypes = {
	dispatch: PropTypes.func.isRequired,
	socket: PropTypes.object.isRequired,
	tasks: PropTypes.array.isRequired,
	categories: PropTypes.array.isRequired,
	fetchingTasks: PropTypes.bool.isRequired,
	profile: PropTypes.object.isRequired,
	isAuthenticated: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(TaskPage);