import * as t from './actionTypes';

const initialState = {
	tasks: [],
	submissions: [],
	fetchingTasks: false,
	fetchingSubmissions: false,
	error: null
};

export default function tasks(state = initialState, action) {
	switch (action.type) {
		case t.FETCH:
			return {
				...state,
				fetchingTasks: true
			};

		case t.FETCH_SUCCESS:
			return {
				...state,
				fetchingTasks: false,
				tasks: action.payload
			};

		case t.FETCH_FAILURE:
			return {
				...state,
				fetchingTasks: false,
				error: action.payload
			};

		case t.ADD_SUCCESS:
			return {
				...state,
				tasks: [...state.tasks, action.payload]
			};
		
		case t.ADD_FAILURE:
			return {
				...state,
				error: action.payload
			};

		case t.DELETE_SUCCESS:
			return {
				...state,
				tasks: state.tasks.filter(task => {
					return task._id !== action.payload;
				})
			};
		
		case t.DELETE_FAILURE:
			return {
				...state,
				error: action.payload
			};

		case t.EDIT_SUCCESS:
			return {
				...state,
				tasks: state.tasks.map(task => {
					return task._id === action.payload._id ?
						{
							...task, 
							name: action.payload.name,
							description: action.payload.description
						} :
						task;
				})
			};
		
		case t.EDIT_FAILURE:
			return {
				...state,
				error: action.payload
			};
		
		case t.TOGGLE_ARCHIVE_SUCCESS:
			return {
				...state,
				tasks: state.tasks.map(task => {
					return task._id === action.payload._id ?
						{
							...task,
							archive: action.payload.archive
						} :
						task;
				})
			};
		
		case t.TOGGLE_ARCHIVE_FAILURE:
			return {
				...state,
				error: action.payload
			};

		case t.CLEAR:
			return {
				...state,
				tasks: []
			};

		case t.EDIT_CLAIMS_SUCCESS:
			return {
				...state,
				tasks: state.tasks.map(task => {
					return task._id === action.payload._id ?
						{
							...task,
							claims: action.payload.claims
						} :
						task;
				})
			};
		
		case t.EDIT_CLAIMS_FAILURE:
			return {
				...state,
				error: action.payload
			};
		
		case t.ADD_SUBMISSION_SUCCESS:
			return {
				...state,
				tasks: state.tasks.map(task => {
					return task._id === action.payload._id ?
						{
							...task,
							submissions: action.payload.submissions
						} :
						task;
				})
			};
		
		case t.ADD_SUBMISSION_FAILURE:
			return {
				...state,
				error: action.payload
			};

		case t.DELETE_SUBMISSION_SUCCESS:
			return {
				...state,
				tasks: state.tasks.map(task => {
					return task._id === action.payload._id ?
						{
							...task,
							submissions: action.payload.submissions
						} :
						task;
				})
			};
		
		case t.DELETE_SUBMISSION_FAILURE:
			return {
				...state,
				error: action.payload
			};
		
		case t.DELETE_OWN_SUBMISSION_SUCCESS:
			return {
				...state,
				tasks: state.tasks.map(task => {
					return task._id === action.payload._id ?
						{
							...task,
							submissions: action.payload.submissions
						} :
						task;
				})
			};
		
		case t.DELETE_OWN_SUBMISSION_FAILURE:
			return {
				...state,
				error: action.payload
			};
		
		case t.FETCH_SUBMISSIONS:
			return {
				...state,
				fetchingSubmissions: true
			};

		case t.FETCH_SUBMISSIONS_SUCCESS:
			return {
				...state,
				submissions: action.payload,
				fetchingSubmissions: false
			};

		case t.FETCH_SUBMISSIONS_FAILURE:
			return {
				...state,
				error: action.payload,
				fetchingSubmissions: false
			};

		// Return state unchanged if action type is unmatched
		default:
			return state;
	}
}