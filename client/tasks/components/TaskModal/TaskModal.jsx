import React, { Component, PropTypes } from 'react';
import Linkify from 'linkifyjs/react';

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import RequireLoginModal from './RequireLoginModal.jsx';
import AddSubmissionModal from './AddSubmissionModal.jsx';
import DeleteSubmissionModal from './DeleteSubmissionModal.jsx';

import { editClaims, editTask, deleteOwnSubmission } from '../../actions';

class TaskModal extends Component {

	constructor(props) {
		super(props);
		this.state = {
			open: false,
			claimsText: '',
			submissionsText: '', // Can be determined, may not be appropriate for state
			isClaimed: false,
			editDescription: false,
			editName: false
		};
		this.addClaim = this.addClaim.bind(this);
		this.removeClaim = this.removeClaim.bind(this);
	}

	// Update the modal if the selected task changes
	componentWillReceiveProps(nextProps) {
		const prevTask = this.props.task;
		const nextTask = nextProps.task;
		
		if (nextTask !== prevTask) {
			this.generateClaimsText(nextTask.claims);
			this.generateSubmissionsText(nextTask.submissions);
			this.checkIfClaimed(nextTask);
		}
	}

	generateClaimsText(claims) {
		let claimsText = '';

		switch (claims.length) {
			case 0:
				claimsText = 'No one is working on this.';
				break;
			case 1:
				claimsText = `${claims[0]} is working on this.`;
				break;
			case 2:
				claimsText = `${claims[0]} and ${claims[1]} are working on this.`;
				break;
			case 3:
				claimsText = `${claims[0]}, ${claims[1]}, and ${claims[2]} are working on this.`;
				break;
			default:
				claimsText = `${claims.length} users are working on this.`;
		}

		this.setState({ claimsText });
	}

	generateSubmissionsText(submissions) {
		const { role, username } = this.props.profile;

		let numberOfSubmissions = '';
		switch (submissions.length) {
			case 0:
				numberOfSubmissions = '0 submissions';
				break;
			case 1:
				numberOfSubmissions = '1 submission';
				break;
			default:
				numberOfSubmissions = `${submissions.length} submissions`;
		}

		let submissionLinks = submissions.map((submission, index) => {
			let deleteSubmissionButton = null;
			if (role === 'admin') {
				// Admins can delete any submission
				deleteSubmissionButton = (
					<span className='submission-delete-btn' onTouchTap={() => this.DeleteSubmissionModal.toggleModal(submission)}> x </span>
				);
			}
			else if (username === submission.username) {
				// Users can delete their own submission
				deleteSubmissionButton = (
					<span className='submission-delete-btn' onTouchTap={this.deleteOwnSubmission.bind(this, submission)}> x </span>
				);
			}

			return (
				<p key={index}>
					<a href={submission.url} target='_blank'>Submission {index + 1} - {submission.username}</a>
					{deleteSubmissionButton}
				</p>
			);
		});

		let submissionsText = (
			<div className='task-modal-submissions'>
				<p>{numberOfSubmissions}</p>
				{submissionLinks}
			</div>
		);

		this.setState({ submissionsText });
	}

	// Check if user has claimed the task
	checkIfClaimed(task) {
		const { username } = this.props.profile;
		let isClaimed = (task.claims.indexOf(username) !== -1) ? true : false;
		this.setState({ isClaimed });
	}

	addClaim() {
		const { task, category, dispatch, socket } = this.props;
		const { claims } = task;
		const { username } = this.props.profile;

		const updatedClaims = (task.claims.indexOf(username) === -1) ? [...claims, username] : claims; // Prevent duplicate usernames in claims
		const updatedTask = { ...task, claims: updatedClaims };
		this.setState({ isClaimed: true });
		this.generateClaimsText(updatedClaims);
		dispatch(editClaims(category, updatedTask, socket));
	}

	removeClaim() {
		const { task, category, dispatch, socket } = this.props;
		const { claims } = task;
		const { username } = this.props.profile;

		const updatedClaims = claims.filter((user) => user !== username);
		const updatedTask = { ...task, claims: updatedClaims };
		this.setState({ isClaimed: false });
		this.generateClaimsText(updatedClaims);
		dispatch(editClaims(category, updatedTask, socket));
	}

	deleteOwnSubmission(submissionToDelete) {
		const { task, setSelectedTask, dispatch, socket } = this.props;

		const updatedSubmissions = task.submissions.filter(sub => sub !== submissionToDelete);
		const updatedTask = { ...task, submissions: updatedSubmissions };
		setSelectedTask(updatedTask);
		dispatch(deleteOwnSubmission(task, updatedSubmissions, submissionToDelete.username, updatedTask, socket));
	}

	toggleModal() {
		this.setState((prevState) => {
			return { open: !prevState.open, editName: false, editDescription: false };
		});
	}

	toggleEditName() {
		this.setState((prevState) => {
			return { editName: !prevState.editName };
		});
	}

	toggleEditDescription() {
		this.setState((prevState) => {
			return { editDescription: !prevState.editDescription };
		});
	}

	checkTaskEditInput(event) {
		switch (event.keyCode) {
			case 13:
				if (!event.shiftKey) {
					// enter: Save task edit and leave edit mode
					const editedTask = this.getEditedTask(this.props.task, event);
					this.editTask(editedTask);
					if (event.target.name === 'description') {
						this.toggleEditDescription();
					}
					else {
						this.toggleEditName();
					}
				}
				else {
					// shift + enter: newline
				}
				break;
			case 27:
				// escape: Leave edit mode without save
				if (event.target.name === 'description') {
					this.toggleEditDescription();
				}
				else {
					this.toggleEditName();
				}
				break;
		}
	}

	getEditedTask(task, event) {
		if (event.target.name === 'name') {
			return { ...task, name: event.target.value };
		}
		else if (event.target.name === 'description') {
			return { ...task, description: event.target.value };
		}
	}

	editTask(updatedTask) {
		const { category, socket, setSelectedTask } = this.props;
		setSelectedTask(updatedTask);
		this.props.dispatch(editTask(category, updatedTask, socket));
	}

	render() {
		const { dispatch, task, profile, isAuthenticated, socket } = this.props;
		const { isClaimed, claimsText, submissionsText, editDescription, editName } = this.state;

		// Claim task button
		let claimBtn;
		if (isClaimed && isAuthenticated) {
			claimBtn = <FlatButton label='Unclaim' onTouchTap={this.removeClaim} />;
		}
		else if (isAuthenticated) {
			claimBtn = <FlatButton label='Claim' onTouchTap={this.addClaim} primary={true} />;
		}
		else {
			claimBtn = <FlatButton label='Claim' onTouchTap={() => this.RequireLoginModal.toggleModal()} primary={true} />;
		}

		let taskModalButtons = [
			{ ...claimBtn },
			<FlatButton label='Close' onTouchTap={this.toggleModal.bind(this)} />
		];
		// Add a submit button if task is claimed
		if (isClaimed && isAuthenticated) {
			taskModalButtons.unshift(<FlatButton label='Submit' primary={true} onTouchTap={() => this.AddSubmissionModal.toggleModal()} />);
		}

		return (
			<Dialog
				title={profile.role !== 'admin' ?
					<div>{task.name}</div> :
					<div>{editName ?
						<TextField
							name='name'
							onKeyDown={(event) => this.checkTaskEditInput(event)}
							defaultValue={task.name}
							autoFocus
							/> :
						<div onDoubleClick={this.toggleEditName.bind(this)}>{task.name}</div>
					}</div>
				}
				actions={taskModalButtons}
				modal={false}
				open={this.state.open}
				onRequestClose={this.toggleModal.bind(this)}
				contentStyle={{ width: '100%' }}
				className='task-modal'
				>
				<p className='task-modal-description'>
					{profile.role !== 'admin' ?
						<Linkify>{task.description}</Linkify> :
						<div>{editDescription ?
							<TextField
								name='description'
								onKeyDown={(event) => this.checkTaskEditInput(event)}
								multiLine={true}
								rows={1}
								rowsMax={10}
								fullWidth={true}
								defaultValue={task.description}
								autoFocus
								/> :
							<Linkify
								onDoubleClick={this.toggleEditDescription.bind(this)}
								>
								{task.description}
							</Linkify>
						}</div>
					}
				</p>
				<p className='task-modal-claims'>{claimsText}</p>
				{submissionsText}
				<RequireLoginModal ref={ref => this.RequireLoginModal = ref} />
				<AddSubmissionModal
					ref={ref => this.AddSubmissionModal = ref}
					dispatch={dispatch}
					socket={socket}
					task={task}
					profile={profile}
					removeClaim={this.removeClaim}
					setSelectedTask={this.props.setSelectedTask}
					/>
				<DeleteSubmissionModal
					ref={ref => this.DeleteSubmissionModal = ref}
					dispatch={dispatch}
					socket={socket}
					task={task}
					setSelectedTask={this.props.setSelectedTask}
					/>
			</Dialog>
		);
	}
}

TaskModal.propTypes = {
	dispatch: PropTypes.func.isRequired,
	socket: PropTypes.object.isRequired,
	task: PropTypes.object.isRequired,
	category: PropTypes.string.isRequired,
	profile: PropTypes.object.isRequired,
	isAuthenticated: PropTypes.bool.isRequired,
	setSelectedTask: PropTypes.func.isRequired,
};

export default TaskModal;