import 'whatwg-fetch';
import checkStatus from '../utils/checkStatus.js';
import parseJSON from '../utils/parseJSON.js';

/**
 * Testing only. Changes the user's access level when viewing pages
 * 
 * @param {object} updatedProfile - Profile with new user role
 * @returns {object} updatedProfile
 */
export function changeUserRole(updatedProfile) {
	return {
		type: 'CHANGE_USER_ROLE',
		payload: {
			profile: updatedProfile
		}
	};
}

/**
 * Check if the user is logged in. If so, return their profile
 * 
 * @returns {object} profile
 */
export function checkLogin() {
	return (dispatch) => {
		fetch('/auth/checkLogin', {
			method: 'post',
			credentials: 'same-origin'
		})
		.then(checkStatus)
		.then(parseJSON)
		.then(profile => {
			dispatch({ type: 'LOGIN_SUCCESS', payload: { profile } });
		})
		.catch(err => {
			dispatch({ type: 'LOGIN_FAILURE', payload: err });			
		});
	};
}

/**
 * Log the user out and remove their profile
 */
export function logoutUser() {
	return (dispatch) => {
		fetch('/auth/logout', {
			method: 'POST',
			credentials: 'same-origin'
		})
		.then(() => {
			dispatch({ type: 'LOGOUT_SUCCESS' });
		})
		.catch(err => {
			dispatch({ type: 'LOGOUT_FAILURE', payload: err });
		});
	};
}

/**
 * Remove user from Gitlab group and update their profile
 * 
 * @returns {object} profile - Profile with gitlabId removed
 */
export function unlinkGitlab() {
	return (dispatch) => {
		fetch('/auth/gitlab/unlink', {
			method: 'POST',
			credentials: 'same-origin'
		})
		.then(checkStatus)
		.then(parseJSON)
		.then(profile => {
			dispatch({ type: 'GITLAB_UNLINK_SUCCESS', payload: { profile } });
		})
		.catch(err => {
			dispatch({ type: 'GITLAB_UNLINK_FAILURE', payload: err });
		});
	};
}