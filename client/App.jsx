import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import { grey300, cyan700, cyan500 } from 'material-ui/styles/colors';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Navbar from './navigation/Navbar.jsx';
import Footer from './navigation/Footer.jsx';

import { checkLogin, changeUserRole } from './users/userActions.js';

import io from 'socket.io-client';
const socket = io.connect(process.env.HEROKU_URL);

function mapStateToProps(state) {
	const { isAuthenticated, profile } = state.userReducer;
	return {
		isAuthenticated,
		profile
	};
}

class App extends Component {

	constructor() {
		super();
		this.state = {
			testUserRole: 'default'
		};
	}

	componentWillMount() {
		// Check if the user is logged in
		this.props.dispatch(checkLogin());
	}

	getChildContext() {
		// Add material-ui theme to context
		const { palette } = darkBaseTheme;
		const customTheme = {
			palette: {
				primary1Color: cyan500,
				primary2Color: cyan500
			},
			raisedButton: {
				primaryTextColor: grey300,
				primaryColor: cyan700
			},
			toggle: {
				thumbOffColor: palette.accent1Color
			}
		};
		return { muiTheme: getMuiTheme(darkBaseTheme, customTheme) };
	}

	changeUserRole(event, index, role) {
		// For testing and demo only. Changes the user's role on frontend
		let updatedProfile = {...this.props.profile, role: role };
		this.props.dispatch(changeUserRole(updatedProfile));
		this.setState({ testUserRole: role });
	}

	render() {
		const { dispatch, isAuthenticated, profile } = this.props;
		return (
			<div>
				<div className='wrap'>
					<Navbar
						dispatch={dispatch}
						isAuthenticated={isAuthenticated}
						/>
					<div className='test-role-buttons'>
						<span>Change User Role: &nbsp;</span>
						<DropDownMenu
							value={this.state.testUserRole}
							onChange={this.changeUserRole.bind(this)}
							labelStyle={{ paddingLeft: 0, fontSize: '18px' }}
							underlineStyle={{ borderTop: 'none' }}
							>
							<MenuItem value={'admin'} primaryText={'Admin'} />
							<MenuItem value={'subscriber'} primaryText={'Subscriber'} />
							<MenuItem value={'member'} primaryText={'Member'} />
							<MenuItem value={'default'} primaryText={'Default'} />
						</DropDownMenu>
					</div>
					<div className='main'>
						{this.props.children && React.cloneElement(this.props.children, { dispatch, isAuthenticated, profile, socket })}
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}

export default connect(mapStateToProps)(App);

App.childContextTypes = {
	muiTheme: PropTypes.object.isRequired,
};

App.propTypes = {
	dispatch: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool.isRequired,
	profile: PropTypes.object.isRequired
};