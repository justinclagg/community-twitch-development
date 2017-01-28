import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';

import * as users from '../users';
const { logoutUser } = users;

class Navbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mobileNavOpen: false
        };
        this.toggleMobileNav = this.toggleMobileNav.bind(this);
        this.logoutUser = () => props.dispatch(logoutUser());
    }

    toggleMobileNav() {
        this.setState((prevState) => {
            return { mobileNavOpen: !prevState.mobileNavOpen };
        });
    }

    render() {
        const { isAuthenticated } = this.props;

        return (
            <AppBar
                className="navbar"
                iconElementLeft={
                    <div>
                        <IconButton onTouchTap={this.toggleMobileNav} className="desktop-hidden"><NavigationMenu color="#FFF" /></IconButton>
                        <Link to="/" className="brand-image">
                            <img src={process.env.BRAND_IMAGE} width="80px" />
                            {/*<span className="nav-title">TWITCH</span>*/}
                        </Link>
                        {/*<div className="nav-links mobile-hidden">
							<Link to="/"><FlatButton label="Home" /></Link>
						</div>*/}
                        {/* Mobile navigation menu */}
                        <Drawer
                            docked={false}
                            width={200}
                            open={this.state.mobileNavOpen}
                            onRequestChange={(open) => this.setState({ mobileNavOpen: open })}
                            className="mobile-menu"
                            >
                            <Link to="/">
                                <MenuItem onTouchTap={this.toggleMobileNav}>Home</MenuItem>
                            </Link>
                            <Divider />
                            {isAuthenticated ?
                                <div>
                                    <Link to="/profile">
                                        <MenuItem onTouchTap={this.toggleMobileNav}>Profile</MenuItem>
                                    </Link>
                                    <MenuItem label="Logout" onTouchTap={this.logoutUser}>Logout</MenuItem>
                                </div>
                                :
                                <a href="/user/auth/twitch">
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
                                <RaisedButton label="Logout" onTouchTap={this.logoutUser} />
                            </div>
                            :
                            <a href="/user/auth/twitch">
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

export default Navbar;