const initialState = {
	categories: [],
	tasks: [],
	submissions: [],
	fetchingTasks: false,
	fetchingCategories: false,
	fetchingSubmissions: false,
	error: null
};

export default function taskReducer(state = initialState, action) {
	switch (action.type) {
		case 'FETCH_CATEGORIES':
			return {
				...state,
				fetchingCategories: true
			};

		case 'FETCH_CATEGORIES_FULFILLED':
			return {
				...state,
				fetchingCategories: false,
				categories: action.payload
			};

		case 'FETCH_CATEGORIES_REJECTED':
			return {
				...state,
				fetchingCategories: false,
				error: action.payload
			};

		case 'ADD_CATEGORY_FULFILLED':
			return {
				...state,
				categories: [...state.categories, action.payload]
			};
		
		case 'ADD_CATEGORY_REJECTED':
			return {
				...state,
				error: action.payload
			};

		case 'DELETE_CATEGORY_FULFILLED':
			return {
				...state,
				categories: state.categories.filter((category) => category !== action.payload)
			};
		
		case 'DELETE_CATEGORY_REJECTED':
			return {
				...state,
				error: action.payload
			};

		case 'FETCH_TASKS':
			return {
				...state,
				fetchingTasks: true
			};

		case 'FETCH_TASKS_FULFILLED':
			return {
				...state,
				fetchingTasks: false,
				tasks: action.payload
			};

		case 'FETCH_TASKS_REJECTED':
			return {
				...state,
				fetchingTasks: false,
				error: action.payload
			};

		case 'ADD_TASK_FULFILLED':
			return {
				...state,
				tasks: [...state.tasks, action.payload]
			};
		
		case 'ADD_TASK_REJECTED':
			return {
				...state,
				error: action.payload
			};

		case 'DELETE_TASK_FULFILLED':
			return {
				...state,
				tasks: state.tasks.filter(task => {
					return task._id !== action.payload;
				})
			};
		
		case 'DELETE_TASK_REJECTED':
			return {
				...state,
				error: action.payload
			};

		case 'EDIT_TASK_FULFILLED':
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
		
		case 'EDIT_TASK_REJECTED':
			return {
				...state,
				error: action.payload
			};
		
		case 'ARCHIVE_TASK_FULFILLED':
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
		
		case 'ARCHIVE_TASK_REJECTED':
			return {
				...state,
				error: action.payload
			};

		case 'EDIT_CLAIMS_FULFILLED':
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
		
		case 'EDIT_CLAIMS_REJECTED':
			return {
				...state,
				error: action.payload
			};
		
		case 'EDIT_SUBMISSIONS_FULFILLED':
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
		
		case 'EDIT_SUBMISSIONS_REJECTED':
			return {
				...state,
				error: action.payload
			};

		case 'DELETE_SUBMISSION_FULFILLED':
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
		
		case 'DELETE_SUBMISSION_REJECTED':
			return {
				...state,
				error: action.payload
			};
		
		case 'DELETE_OWN_SUBMISSION_FULFILLED':
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
		
		case 'DELETE_OWN_SUBMISSION_REJECTED':
			return {
				...state,
				error: action.payload
			};
		
		case 'FETCH_SUBMISSIONS':
			return {
				...state,
				fetchingSubmissions: true
			};

		case 'FETCH_SUBMISSIONS_FULFILLED':
			return {
				...state,
				submissions: action.payload,
				fetchingSubmissions: false
			};

		case 'FETCH_SUBMISSIONS_REJECTED':
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