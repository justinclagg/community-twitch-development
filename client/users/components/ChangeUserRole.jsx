import React, { Component, PropTypes } from 'react';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import { changeUserRole } from '..';

class ChangeUserRole extends Component {

	constructor(props) {
		super(props);
		this.state = {
			userRole: 'default'
		};
		this.updateUserRole = this.updateUserRole.bind(this);
		this.changeUserRole = (updatedProfile) => props.dispatch(changeUserRole(updatedProfile));
	}

	updateUserRole(event, index, value) {
		// For testing and demo only. Changes the user's role on frontend
		let updatedProfile = {...this.props.profile, role: value };
		this.changeUserRole(updatedProfile);
		this.setState({ userRole: value });
	}

	render() {
		return (
			<div className='test-role-buttons'>
				<DropDownMenu
					value={this.state.userRole}
					onChange={this.updateUserRole}
					labelStyle={{ paddingLeft: 0, fontSize: '20px' }}
					underlineStyle={{ borderTop: 'none' }}
					>
					<MenuItem value={'admin'} primaryText={'Admin'} />
					<MenuItem value={'subscriber'} primaryText={'Subscriber'} />
					<MenuItem value={'member'} primaryText={'Member'} />
					<MenuItem value={'default'} primaryText={'Default'} />
				</DropDownMenu>
			</div>
		);
	}
}

ChangeUserRole.propTypes = {
	dispatch: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired
};

export default ChangeUserRole;