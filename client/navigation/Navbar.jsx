import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';

import { logoutUser } from '../users/userActions.js';

export default class Navbar extends Component {

	constructor() {
		super();
		this.state = {
			mobileNavOpen: false
		};
	}

	toggleMobileNav() {
		this.setState({ mobileNavOpen: !this.state.mobileNavOpen });
	}

	logoutUser() {
		this.props.dispatch(logoutUser());
	}

	render() {
		const { isAuthenticated } = this.props;

		return (
			<AppBar
				className="navbar"
				iconElementLeft={
					<div>
						<IconButton onTouchTap={this.toggleMobileNav.bind(this)} className="desktop-hidden"><NavigationMenu color="#FFF" /></IconButton>
						<a href="//hardlydifficult.com" className="brand-image">
							<img src={process.env.BRAND_IMAGE} width="80px" />
						</a>
						<div className="nav-links mobile-hidden">
							<Link to="/"><FlatButton label="Home" /></Link>
						</div>
						{/* Mobile navigation menu */}
						<Drawer
							docked={false}
							width={200}
							open={this.state.mobileNavOpen}
							onRequestChange={(open) => this.setState({ mobileNavOpen: open })}
							className="mobile-menu"
							>
							<Link to="/">
								<MenuItem onTouchTap={this.toggleMobileNav.bind(this)}>Home</MenuItem>
							</Link>
							<Divider />
							{isAuthenticated ?
								<div>
									<Link to="/profile">
										<MenuItem onTouchTap={this.toggleMobileNav.bind(this)}>Profile</MenuItem>
									</Link>
									<MenuItem label="Logout" onTouchTap={this.logoutUser.bind(this)}>Logout</MenuItem>
								</div>
								:
								<a href="/auth/twitch">
									<MenuItem>Login with Twitch</MenuItem>
								</a>
							}
						</Drawer>
					</div>
				}
				iconElementRight={
					<div className="nav-user-buttons mobile-hidden">
						{isAuthenticated ?
							<div>
								<Link to="/profile">
									<RaisedButton label="Profile" primary={true} />
								</Link>
								<RaisedButton label="Logout" onTouchTap={this.logoutUser.bind(this)} />
							</div>
							:
							<a href="/auth/twitch">
								<img src="/img/twitch_login_button.png" height="35px" />
							</a>
						}
					</div>
				}
				/>
		);
	}
}

Navbar.propTypes = {
	dispatch: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool.isRequired
};