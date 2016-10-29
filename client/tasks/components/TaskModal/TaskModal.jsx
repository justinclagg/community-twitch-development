import React, { Component, PropTypes } from 'react';
import Linkify from 'linkifyjs/react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RequireLoginModal from './RequireLoginModal.jsx';
import AddSubmissionModal from './AddSubmissionModal.jsx';
import DeleteSubmissionModal from './DeleteSubmissionModal.jsx';

import { editClaims, deleteOwnSubmission } from '../../taskActions.js';

export default class TaskModal extends Component {

	constructor() {
		super();
		this.state = {
			open: false,
			claimsText: '',
			submissionsText: '',
			isClaimed: false
		};
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
					<span className="submission-delete-btn" onTouchTap={() => this.DeleteSubmissionModal.toggleModal(submission)}> x </span>
				);
			}
			else if (username === submission.username) {
				// Users can delete their own submission
				deleteSubmissionButton = (
					<span className="submission-delete-btn" onTouchTap={this.deleteOwnSubmission.bind(this, submission)}> x </span>
				);
			}

			return (
				<p key={index}>
					<a href={submission.url} target="_blank">Submission {index + 1} - {submission.username}</a>
					{deleteSubmissionButton}
				</p>
			);
		});

		let submissionsText = (
			<div className="task-modal-submissions">
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
		const updatedTask = {...task, claims: updatedClaims };
		this.setState({ isClaimed: true });
		this.generateClaimsText(updatedClaims);
		dispatch(editClaims(category, updatedTask, socket));
	}

	removeClaim() {
		const { task, category, dispatch, socket } = this.props;
		const { claims } = task;
		const { username } = this.props.profile;

		const updatedClaims = claims.filter((user) => user !== username);
		const updatedTask = {...task, claims: updatedClaims };
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
		this.setState({ open: !this.state.open });
	}

	render() {
		const { dispatch, task, profile, isAuthenticated, socket } = this.props;
		const { isClaimed, claimsText, submissionsText } = this.state;

		// Claim task button
		let claimBtn;
		if (isClaimed && isAuthenticated) {
			claimBtn = <FlatButton label="Unclaim" onTouchTap={this.removeClaim.bind(this)} />;
		}
		else if (isAuthenticated) {
			claimBtn = <FlatButton label="Claim" onTouchTap={this.addClaim.bind(this)} primary={true} />;
		}
		else {
			claimBtn = <FlatButton label="Claim" onTouchTap={() => this.RequireLoginModal.toggleModal()} primary={true} />;
		}

		let taskModalButtons = [
			{...claimBtn},
			<FlatButton label="Close" onTouchTap={this.toggleModal.bind(this)} />
		];
		// Add a submit button if task is claimed
		if (isClaimed && isAuthenticated) {
			taskModalButtons.unshift(<FlatButton label="Submit" primary={true} onTouchTap={() => this.AddSubmissionModal.toggleModal()} />);
		}

		return (
			<Dialog
				title={task.name}
				actions={taskModalButtons}
				modal={false}
				open={this.state.open}
				onRequestClose={this.toggleModal.bind(this)}
				contentStyle={{ width: '100%' }}
				className="task-modal"
				>
				<p className="task-modal-description">
					<Linkify>{task.description}</Linkify>
				</p>
				<p className="task-modal-claims">{claimsText}</p>
				{submissionsText}
				<RequireLoginModal ref={ref => this.RequireLoginModal = ref} />
				<AddSubmissionModal
					ref={ref => this.AddSubmissionModal = ref}
					dispatch={dispatch}
					socket={socket}
					task={task}
					profile={profile}
					removeClaim={this.removeClaim.bind(this)}
					setSelectedTask={this.props.setSelectedTask.bind(this)}
					/>
				<DeleteSubmissionModal
					ref={ref => this.DeleteSubmissionModal = ref}
					dispatch={dispatch}
					socket={socket}
					task={task}
					setSelectedTask={this.props.setSelectedTask.bind(this)}
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