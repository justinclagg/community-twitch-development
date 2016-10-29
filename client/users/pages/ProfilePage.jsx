import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import userHasAccess from '../../utils/userHasAccess';
import { unlinkGitlab } from '../userActions.js';

export default class ProfilePage extends Component {
	
	unlinkGitlab() {
		this.props.dispatch(unlinkGitlab());
	}

	render() {
		let profileCard;
		if (this.props.isAuthenticated) {
			// User logged in
			const { profile } = this.props;
			let gitlabSection;
			if (userHasAccess(profile, process.env.GITLAB_ACCESS_LEVEL)) {
				// User has Gitlab access
				if (profile.gitlabId) {
					// Gitlab account already linked
					const { GITLAB_GROUP_ID } = process.env;
					gitlabSection = (
						<div className="profile-gitlab-section">
							<p>Click below to view the project repository.</p>
							<p>
								<a href={`https://gitlab.com/groups/${GITLAB_GROUP_ID}`} target="_blank">
									<RaisedButton label="Go to GitLab" primary={true} />
								</a>
								<RaisedButton label="Unlink GitLab" onTouchTap={this.unlinkGitlab.bind(this)} />
							</p>
						</div>
					);
				}
				else {
					// Gitlab account unlinked
					gitlabSection = (
						<div className="profile-gitlab-section">
							<p>Connect your GitLab account to gain access to the project repository.</p>
							<a href="/auth/gitlab">
								<RaisedButton label="Connect GitLab" primary={true} />
							</a>
						</div>
					);
				}
			}
			profileCard = (
				<Paper className="profile-card" zDepth={1}>
					<h4>Username:</h4>
					<p>{profile.username}</p>
					<h4>Email:</h4>
					<p>{profile.email}</p>
					<h4>Status:</h4>
					<p>{profile.role}</p>
					{profile.role === 'admin' &&
						<Link to="/admin">
							<RaisedButton label="Admin Panel" primary={true} />
						</Link>
					}
					{gitlabSection}
				</Paper>
			);
		}
		else {
			// User not logged in
			profileCard = (
				<Paper className="profile-card" zDepth={1}>
					<h3>Please sign in to view your profile.</h3>
				</Paper>
			);
		}

		return (
			<div className="profile-page">
				<h1 className="page-title">Profile</h1>
				{profileCard}
			</div>
		);
	}
}

ProfilePage.propTypes = {
	dispatch: PropTypes.func,
	isAuthenticated: PropTypes.bool,
	profile: PropTypes.object
};