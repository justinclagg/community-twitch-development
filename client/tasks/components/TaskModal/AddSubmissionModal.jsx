import React, { Component, PropTypes } from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import { editSubmissions } from '../../taskActions.js';
import validUrl from '../../../utils/validURl.js';

export default class AddSubmissionModal extends Component {

	constructor() {
		super();
		this.state = {
			open: false,
			error: null
		};
	}

	checkForSubmit(event) {
		if (event.keyCode === 13) {
			// Submit on enter
			this.addSubmission();
		}
	}

	// Return url if valid, otherwise return false
	validUrl(url) {
		url = validUrl(url);
		if (!url) {
			this.setState({ error: 'Invalid URL' });
		}
		return url;
	}

	addSubmission() {
		const { task, profile, removeClaim, setSelectedTask, dispatch, socket } = this.props;
		const url = this.validUrl(this.SubmissionField.input.value);

		if (url === false) {
			// Exit early if url is invalid
			return;
		}

		const submission = {
			date: new Date().getTime(),
			username: profile.username,
			url
		};
		const updatedSubmissions = [...task.submissions, submission];
		const updatedTask = {...task, submissions: updatedSubmissions };

		setSelectedTask(updatedTask);
		dispatch(editSubmissions(task, updatedSubmissions, updatedTask, socket));
		removeClaim();
		this.toggleModal();
	}

	toggleModal() {
		this.setState({
			open: !this.state.open,
			error: null
		});
	}

	render() {
		const { open, error } = this.state;
		return (
			<Dialog
				title="Submit your work"
				actions={[
					<FlatButton label="Submit" onTouchTap={this.addSubmission.bind(this)} primary={true} />,
					<FlatButton label="Close" onTouchTap={this.toggleModal.bind(this)} />
				]}
				modal={false}
				open={open}
				onRequestClose={this.toggleModal.bind(this)}
				className="task-modal"
				contentStyle={{ width: '100%' }}
				>
				<TextField
					ref={ref => this.SubmissionField = ref}
					hintText="Submission Link"
					errorText={error}
					name="submission"
					onKeyDown={this.checkForSubmit.bind(this)}
					fullWidth={true}
					autoComplete="off"
					autoFocus
					/>
				{/* Possible future submission terms
					<TextField
						value={termsText}
						multiLine={true}
						rowsMax={5}
						fullWidth={true}
						/>
					<Checkbox
						label="I agree to the terms"
						style={{opacity: "0.8"}}
						/>
				*/}
			</Dialog>
		);
	}
}

AddSubmissionModal.propTypes = {
	dispatch: PropTypes.func.isRequired,
	socket: PropTypes.object.isRequired,
	task: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
	removeClaim: PropTypes.func.isRequired,
	setSelectedTask: PropTypes.func.isRequired
};