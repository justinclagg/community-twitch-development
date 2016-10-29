const initialState = {
	isAuthenticated: false,
	profile: { role: 'none' }, // _id, username, email, role, gitlabId
	error: null
};

export default function userReducer(state = initialState, action) {
	switch (action.type) {
		case 'CHANGE_USER_ROLE':
			let isAuthenticated = true;
			if (action.payload.profile.role === 'none') {
				isAuthenticated = false;
			}
			return {
				...state,
				isAuthenticated,
				profile: action.payload.profile
			};

		case 'LOGIN_SUCCESS':
			return {
				...state,
				isAuthenticated: true,
				profile: action.payload.profile
			};

		case 'LOGIN_FAILURE':
			return {
				...state,
				isAuthenticated: false,
				profile: {},
				error: action.payload
			};

		case 'LOGOUT_SUCCESS':
			return {
				...state,
				isAuthenticated: false,
				profile: {}
			};

		case 'LOGOUT_FAILURE':
			return {
				...state,
				error: action.payload
			};

		case 'GITLAB_UNLINK_SUCCESS':
			return {
				...state,
				profile: action.payload.profile
			};

		case 'GITLAB_UNLINK_FAILURE':
			return {
				...state,
				error: action.payload
			};

		default:
			return state;
	}
}