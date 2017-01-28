import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import { grey300, cyan700, cyan500 } from 'material-ui/styles/colors';

import { Navbar, Footer } from './shared';
import { checkLogin, ChangeUserRole } from './users';

import io from 'socket.io-client';
const socket = io.connect(process.env.HEROKU_URL);

function mapStateToProps(state) {
    const { isAuthenticated, profile } = state.users;
    return {
        isAuthenticated,
        profile
    };
}

class App extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
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

    render() {
        const { dispatch, isAuthenticated, profile } = this.props;
        return (
            <div>
                <div className='wrap'>
                    <Navbar
                        dispatch={dispatch}
                        isAuthenticated={isAuthenticated}
                        />
                    <ChangeUserRole
                        dispatch={dispatch}
                        profile={profile}
                        />
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