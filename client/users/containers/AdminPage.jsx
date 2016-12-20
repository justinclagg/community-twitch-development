import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import { LoadingSpinner } from '../../shared';

import { fetchSubmissions } from '../../tasks';
import { getLocalTime, getLocalDate } from '../../utils/formatTime';

function mapStateToProps(state) {
	const { submissions, fetchingSubmissions } = state.tasks;
	return {
		submissions,
		fetchingSubmissions
	};
}

class AdminPage extends Component {

	constructor(props) {
		super(props);
		this.fetchSubmissions = () => props.dispatch(fetchSubmissions());
	}

	componentWillMount() {
		this.fetchSubmissions();
	}

	componentDidMount() {
		const { socket } = this.props;
		socket.on('submissions', () => this.fetchSubmissions());
	}

	/**
	 * Create a clickable submission, dated using the user's local time
	 * 
	 * @param {string} displayType - How to format the submission's time. Accepted values are 'time' and 'date'
	 * @param {object} submission
	 * @param {number} index - Loop index, used for a unique React key
	 * @returns JSX component
	 */
	generateSubmission(displayType, submission, index) {
		const { date, username, name, category, url, archive } = submission;

		let time = '';
		if (displayType === 'time') {
			time = getLocalTime(new Date(date));
		}
		else if (displayType === 'date') {
			time = getLocalDate(new Date(date));
		}

		const submissionClass = archive ? 'admin-archived-submission' : 'admin-submission';
		return (
			<p key={index}>
				<a href={url} target="_blank" className={submissionClass}>
					<span className="submission-list-time">{time}</span>
					<span className="submission-list-category">[ {category} ]</span>
					<span className="submission-list-name">{name}</span>
					<span className="submission-list-username">&ndash; {username}</span>
				</a>
			</p>
		);
	}

	render() {
		const { profile, submissions, fetchingSubmissions } = this.props;
		let todaySubmissions = [];
		let yesterdaySubmissions = [];
		let weekSubmissions = [];

		if (profile.role === 'admin') {
			const today = new Date().setHours(0, 0, 0, 0);
			const yesterday = today - 24 * 3600 * 1000;
			const week = today - 7 * 24 * 3600 * 1000;
			const numSubmissions = submissions.length;

			// Loop through submissions and group them based on time since submission
			for (let i = 0; i < numSubmissions; i++) {
				const submissionDate = submissions[i].date;
				const submission = (displayType) => this.generateSubmission(displayType, submissions[i], i);

				if (submissionDate > today) {
					todaySubmissions.push(submission('time'));
				}
				else if (submissionDate < today && submissionDate >= yesterday) {
					yesterdaySubmissions.push(submission('time'));
				}
				else if (submissionDate < yesterday && submissionDate >= week) {
					weekSubmissions.push(submission('date'));
				}
			}
		}

		return (
			<div className="admin-page">
				<h1 className="page-title">Admin Panel</h1>
				<Paper className="admin-card" zDepth={1}>
					{profile.role === 'admin' ?
						<div>
							<h2>Submission History</h2>
							<h3>Today</h3>
							{todaySubmissions}
							<Divider />
							<h3>Yesterday</h3>
							{yesterdaySubmissions}
							<Divider />
							<h3>This Week</h3>
							{weekSubmissions}
							{fetchingSubmissions &&
								<LoadingSpinner />
							}
						</div> :
						<p>Sign in as an admin to view this page.</p>
					}
				</Paper>
			</div>
		);
	}
}

export default connect(mapStateToProps)(AdminPage);

AdminPage.propTypes = {
	profile: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	socket: PropTypes.object.isRequired,
	submissions: PropTypes.array.isRequired,
	fetchingSubmissions: PropTypes.bool.isRequired
};