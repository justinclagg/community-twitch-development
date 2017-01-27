import * as t from './actionTypes';
import checkStatus from '../utils/checkStatus';
import parseJSON from '../utils/parseJSON';

/**
 * Testing only. Changes the user's access level when viewing pages
 * 
 * @param {object} updatedProfile - Profile with new user role
 * @returns {object} updatedProfile
 */
export function changeUserRole(updatedProfile) {
	return {
		type: t.CHANGE_ROLE,
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
		fetch('/user/auth/checkLogin', {
			method: 'post',
			credentials: 'same-origin'
		})
		.then(checkStatus)
		.then(parseJSON)
		.then(profile => {
			dispatch({ type: t.LOGIN_SUCCESS, payload: { profile } });
		})
		.catch(err => {
			dispatch({ type: t.LOGIN_FAILURE, payload: err });			
		});
	};
}

/**
 * Log the user out and remove their profile
 */
export function logoutUser() {
	return (dispatch) => {
		fetch('/user/auth/logout', {
			method: 'POST',
			credentials: 'same-origin'
		})
		.then(() => {
			dispatch({ type: t.LOGOUT_SUCCESS });
		})
		.catch(err => {
			dispatch({ type: t.LOGOUT_FAILURE, payload: err });
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
		fetch('/user/auth/gitlab/unlink', {
			method: 'POST',
			credentials: 'same-origin'
		})
		.then(checkStatus)
		.then(parseJSON)
		.then(profile => {
			dispatch({ type: t.GITLAB_UNLINK_SUCCESS, payload: { profile } });
		})
		.catch(err => {
			dispatch({ type: t.GITLAB_UNLINK_FAILURE, payload: err });
		});
	};
}