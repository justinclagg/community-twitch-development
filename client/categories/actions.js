import 'whatwg-fetch';
import * as t from './actionTypes';
import checkStatus from '../utils/checkStatus.js';
import parseJSON from '../utils/parseJSON.js';

/**
 * Get a list of all categories
 * 
 * @returns {array} categories - Array of category names
 */
export function fetchCategories() {
	return (dispatch) => {
		dispatch({ type: t.FETCH });
		fetch('/live/categories')
			.then(checkStatus)
			.then(parseJSON)
			.then(categories => {
				dispatch({ type: t.FETCH_SUCCESS, payload: categories });
			})
			.catch(err => {
				dispatch({ type: t.FETCH_FAILURE, payload: err });
			});
	};
}

/**
 * Add a new category (admin only)
 * 
 * @param {string} category
 * @param {object} socket
 * @returns {string} category
 */
export function addCategory(category, socket) {
	return (dispatch) => {
		fetch('/live/categories', {
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ category })
		})
			.then(checkStatus)
			.then(() => {
				dispatch({ type: t.ADD_SUCCESS, payload: category });
				socket.emit('categories');
			})
			.catch(err => {
				dispatch({ type: t.ADD_FAILURE, payload: err });
			});
	};
}

/**
 * Delete a category (admin only)
 * 
 * @param {string} category
 * @param {object} socket
 * @returns {string} category
 */
export function deleteCategory(category, socket) {
	return (dispatch) => {
		fetch('/live/categories/', {
			method: 'DELETE',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ category })
		})
			.then(checkStatus)
			.then(() => {
				dispatch({ type: t.DELETE_SUCCESS, payload: category });
				socket.emit('categories');
			})
			.catch(err => {
				dispatch({ type: t.DELETE_FAILURE, payload: err });
			});
	};
}