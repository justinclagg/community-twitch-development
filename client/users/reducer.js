import * as t from './actionTypes';

const initialState = {
	isAuthenticated: false,
	profile: { role: 'none' }, // _id, username, email, role, gitlabId
	error: null
};

export default (state = initialState, action) => {
	switch (action.type) {
		case t.CHANGE_ROLE:
			if (action.payload.profile.role === 'none') {
				return {
					...state,
					isAuthenticated: false,
					profile: action.payload.profile
				};
			}
			else {
				return {
					...state,
					isAuthenticated: true,
					profile: action.payload.profile
				};
			}

		case t.LOGIN_SUCCESS:
			return {
				...state,
				isAuthenticated: true,
				profile: action.payload.profile
			};

		case t.LOGIN_FAILURE:
			return {
				...state,
				isAuthenticated: false,
				profile: {},
				error: action.payload
			};

		case t.LOGOUT_SUCCESS:
			return {
				...state,
				isAuthenticated: false,
				profile: {}
			};

		case t.LOGOUT_FAILURE:
			return {
				...state,
				error: action.payload
			};

		case t.GITLAB_UNLINK_SUCCESS:
			return {
				...state,
				profile: action.payload.profile
			};

		case t.GITLAB_UNLINK_FAILURE:
			return {
				...state,
				error: action.payload
			};

		default:
			return state;
	}
};