import * as t from './actionTypes';

const initialState = {
	categories: [],
	fetchingCategories: false,
	error: null
};

export default (state = initialState, action) => {
	switch (action.type) {
		case t.FETCH:
			return {
				...state,
				fetchingCategories: true
			};
		
		case t.FETCH_SUCCESS:
			return {
				...state,
				fetchingCategories: false,
				categories: action.payload
			};
		
		case t.FETCH_FAILURE:
			return {
				...state,
				fetchingCategories: false,
				error: action.payload
			};
		
		case t.ADD_SUCCESS:
			return {
				...state,
				categories: [...state.categories, action.payload]
			};
		
		case t.ADD_FAILURE:
			return {
				...state,
				error: action.payload
			};

		case t.DELETE_SUCCESS:
			return {
				...state,
				categories: state.categories.filter((category) => category !== action.payload)
			};
		
		case t.DELETE_FAILURE:
			return {
				...state,
				error: action.payload
			};

		default:
			return state;
	}
};