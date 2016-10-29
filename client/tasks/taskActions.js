import 'whatwg-fetch';
import checkStatus from '../utils/checkStatus.js';
import parseJSON from '../utils/parseJSON.js';

/**
 * Get all tasks in the specified category
 * 
 * @param {string} category
 * @returns {array} tasks - Array of task objects in the given category
 */
export function fetchTasks(category) {
	return (dispatch) => {
		dispatch({ type: 'FETCH_TASKS' });
		category = encodeURIComponent(category);
		fetch(`/live/tasks/${category}`)
			.then(checkStatus)
			.then(parseJSON)
			.then(tasks => {
				dispatch({ type: 'FETCH_TASKS_FULFILLED', payload: tasks });
			})
			.catch(err => {
				dispatch({ type: 'FETCH_TASKS_REJECTED', payload: err });
			});
	};
}

/**
 * Get a list of all categories
 * 
 * @returns {array} categories - Array of category names
 */
export function fetchCategories() {
	return (dispatch) => {
		dispatch({ type: 'FETCH_CATEGORIES' });
		fetch('/live/categories')
			.then(checkStatus)
			.then(parseJSON)
			.then(categories => {
				dispatch({ type: 'FETCH_CATEGORIES_FULFILLED', payload: categories });
			})
			.catch(err => {
				dispatch({ type: 'FETCH_CATEGORIES_REJECTED', payload: err });
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
				dispatch({ type: 'ADD_CATEGORY_FULFILLED', payload: category });
				socket.emit('categories');
			})
			.catch(err => {
				dispatch({ type: 'ADD_CATEGORY_REJECTED', payload: err });
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
				dispatch({ type: 'DELETE_CATEGORY_FULFILLED', payload: category });
				socket.emit('categories');
			})
			.catch(err => {
				dispatch({ type: 'DELETE_CATEGORY_REJECTED', payload: err });
			});
	};
}

/**
 * Add a new task (admin only)
 * 
 * @param {string} category
 * @param {string} name
 * @param {string} description
 * @param {object} socket 
 * @returns {object} task - New task with _id returned from server
 */
export function addTask(category, name, description, socket) {
	return (dispatch) => {
		const payload = {
			category,
			name,
			description,
			claims: [],
			submissions: [],
			archive: false
		};
		fetch(`/live/tasks/${category}`, {
			method: 'POST',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		})
			.then(checkStatus)
			.then(parseJSON)
			.then(task => {
				dispatch({ type: 'ADD_TASK_FULFILLED', payload: {...payload, _id: task._id} });
				socket.emit('tasks');
			})
			.catch(err => {
				dispatch({ type: 'ADD_TASK_REJECTED', payload: err });
			});
	};
}

/**
 * Delete a task (admin only)
 * 
 * @param {string} category
 * @param {string} _id
 * @param {object} socket 
 * @returns {string} _id
 */
export function deleteTask(category, _id, socket) {
	return (dispatch) => {
		fetch(`/live/tasks/${category}`, {
			method: 'DELETE',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ _id })
		})
			.then(checkStatus)
			.then(() => {
				dispatch({ type: 'DELETE_TASK_FULFILLED', payload: _id });
				socket.emit('tasks');
			})
			.catch(err => {
				dispatch({ type: 'DELETE_TASK_REJECTED', payload: err });
			});
	};
}

/**
 * Edit a task (admin only)
 * 
 * @param {string} category
 * @param {object} task - Task updated with new name and/or description
 * @param {object} socket
 * @returns {object} payload - Task id, name, and description
 */
export function editTask(category, task, socket) {
	return (dispatch) => {
		const payload = {
			_id: task._id,
			name: task.name,
			description: task.description
		};
		fetch(`/live/tasks/${category}`, {
			method: 'PUT',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		})
			.then(checkStatus)
			.then(() => {
				dispatch({ type: 'EDIT_TASK_FULFILLED', payload });
				socket.emit('task modal', task);
				socket.emit('tasks');				
			})
			.catch(err => {
				dispatch({ type: 'EDIT_TASK_REJECTED', payload: err });
			});
	};
}

/**
 * Archive / unarchive a task (admin only)
 * 
 * @param {object} task
 * @param {object} socket 
 * @returns {object} payload - Task id and archive value
 */
export function toggleArchiveTask(task, socket) {
	return (dispatch) => {
		const payload = {
			_id: task._id,
			archive: !task.archive
		};
		fetch(`/live/archive/${task.category}`, {
			method: 'PUT',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		})
			.then(checkStatus)
			.then(() => {
				dispatch({ type: 'ARCHIVE_TASK_FULFILLED', payload });
				socket.emit('tasks');
			})
			.catch(err => {
				dispatch({ type: 'ARCHIVE_TASK_REJECTED', payload: err });
			});
	};
}

/**
 * Add or remove a task claim
 * 
 * @param {string} category
 * @param {object} task - Task with updated array of claims
 * @param {object} socket 
 * @returns {object} payload - Task id and claims
 */
export function editClaims(category, task, socket) {
	return (dispatch) => {
		const payload = {
			_id: task._id,
			claims: task.claims
		};
		fetch(`/live/claims/${category}`, {
			method: 'PUT',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		})
			.then(checkStatus)
			.then(() => {
				dispatch({ type: 'EDIT_CLAIMS_FULFILLED', payload });
				socket.emit('task modal', task);
				socket.emit('tasks');
			})
			.catch(err => {
				dispatch({ type: 'EDIT_CLAIMS_REJECTED', payload: err });
			});
	};
}

/**
 * Add a task submission (admin only)
 * 
 * @param {object} task
 * @param {array} updatedSubmissions
 * @param {object} socket
 * @returns {object} payload - Task id and submissions
 */
export function editSubmissions(task, updatedSubmissions, updatedTask, socket) {
	return (dispatch) => {
		const { _id, category } = task;
		const payload = {
			_id,
			submissions: updatedSubmissions
		};
		fetch(`/live/submissions/${category}`, {
			method: 'PUT',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		})
			.then(checkStatus)
			.then(() => {
				dispatch({ type: 'EDIT_SUBMISSIONS_FULFILLED', payload });
				socket.emit('submissions', updatedTask);
			})
			.catch(err => {
				dispatch({ type: 'EDIT_SUBMISSIONS_REJECTED', payload: err });
			});
	};
}

/**
 * Delete a task submission (admin only)
 * 
 * @param {object} task
 * @param {array} updatedSubmissions
 * @param {object} socket
 * @returns {object} payload - Task id and submissions
 */
export function deleteSubmission(task, updatedSubmissions, updatedTask, socket) {
	return (dispatch) => {
		const { _id, category } = task;
		const payload = {
			_id,
			submissions: updatedSubmissions
		};
		fetch(`/live/submissions/${category}`, {
			method: 'DELETE',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		})
			.then(checkStatus)
			.then(() => {
				dispatch({ type: 'DELETE_SUBMISSION_FULFILLED', payload });
				socket.emit('submissions', updatedTask);
			})
			.catch(err => {
				dispatch({ type: 'DELETE_SUBMISSION_REJECTED', payload: err });
			});
	};
}

/**
 * Delete your own task submission
 * 
 * @param {object} task
 * @param {array} updatedSubmissions
 * @param {string} submissionUsername
 * @param {object} socket
 * @returns {object} payload - Task id, submissions and username
 */
export function deleteOwnSubmission(task, updatedSubmissions, submissionUsername, updatedTask, socket) {
	return (dispatch) => {
		const { _id, category } = task;
		const payload = {
			_id,
			submissions: updatedSubmissions,
			submissionUsername
		};
		fetch(`/live/ownSubmission/${category}`, {
			method: 'DELETE',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		})
			.then(checkStatus)
			.then(() => {
				dispatch({ type: 'DELETE_OWN_SUBMISSION_FULFILLED', payload });
				socket.emit('submissions', updatedTask);
			})
			.catch(err => {
				dispatch({ type: 'DELETE_OWN_SUBMISSION_REJECTED', payload: err });
			});
	};
}

/**
 * Get an array of all submissions (admin only)
 * 
 * @returns {array} submissionList
 */
export function fetchSubmissions() {
	return (dispatch) => {
		dispatch({ type: 'FETCH_SUBMISSIONS' });
		fetch('/live/admin/submissions', {
			method: 'GET',
			credentials: 'same-origin'
		})
			.then(checkStatus)
			.then(parseJSON)
			.then(tasks => {
				let submissionList = [];
				tasks.forEach(task => {
					// Add the task name, category, and archive status to each submission
					let taskSubmissions = task.submissions.map(submission => { 
						return {
							...submission,
							name: task.name,
							category: task.category,
							archive: task.archive
						};
					});
					// Flatten array of submissions and combine with submissionList
					submissionList = [...submissionList, ...taskSubmissions];
				});
				// Order submissions from newest to oldest
				submissionList.sort((a, b) => b.date - a.date);
				dispatch({ type: 'FETCH_SUBMISSIONS_FULFILLED', payload: submissionList });
			})
			.catch(err => {
				dispatch({ type: 'FETCH_SUBMISSIONS_REJECTED', payload: err });
			});
	};
}