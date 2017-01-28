import * as t from './actionTypes';
import checkStatus from '../utils/checkStatus';
import parseJSON from '../utils/parseJSON';
import submissionList from '../utils/submissionList';

/**
 * Get all tasks in the specified category
 * 
 * @param {string} category
 * @returns {array} tasks - Array of task objects in the given category
 */
export function fetchTasks(category) {
    return (dispatch) => {
        dispatch({ type: t.FETCH });
        category = encodeURIComponent(category);
        return fetch(`/task/${category}`)
            .then(checkStatus)
            .then(parseJSON)
            .then(tasks => {
                dispatch({ type: t.FETCH_SUCCESS, payload: tasks });
            })
            .catch(err => {
                dispatch({ type: t.FETCH_FAILURE, payload: err });
            });
    };
}

export function clearTasks() {
    return { type: t.CLEAR };
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
        const task = {
            category,
            name,
            description,
            claims: [],
            submissions: [],
            archive: false
        };
        return fetch(`/task/${category}`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        })
            .then(checkStatus)
            .then(parseJSON)
            .then(newTask => {
                socket.emit('tasks');
                dispatch({ type: t.ADD_SUCCESS, payload: { ...task, _id: newTask._id } });
            })
            .catch(err => {
                dispatch({ type: t.ADD_FAILURE, payload: err });
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
        return fetch(`/task/${category}`, {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id })
        })
            .then(checkStatus)
            .then(() => {
                dispatch({ type: t.DELETE_SUCCESS, payload: _id });
                socket.emit('tasks');
            })
            .catch(err => {
                dispatch({ type: t.DELETE_FAILURE, payload: err });
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
        return fetch(`/task/${category}`, {
            method: 'PUT',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(checkStatus)
            .then(() => {
                dispatch({ type: t.EDIT_SUCCESS, payload });
                socket.emit('task modal', task);
                socket.emit('tasks');
            })
            .catch(err => {
                dispatch({ type: t.EDIT_FAILURE, payload: err });
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
export function toggleArchive(task, socket) {
    return (dispatch) => {
        const payload = {
            _id: task._id,
            archive: !task.archive
        };
        fetch(`/task/archive/${task.category}`, {
            method: 'PUT',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(checkStatus)
            .then(() => {
                dispatch({ type: t.TOGGLE_ARCHIVE_SUCCESS, payload });
                socket.emit('tasks');
            })
            .catch(err => {
                dispatch({ type: t.TOGGLE_ARCHIVE_FAILURE, payload: err });
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
        fetch(`/task/claims/${category}`, {
            method: 'PUT',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(checkStatus)
            .then(() => {
                dispatch({ type: t.EDIT_CLAIMS_SUCCESS, payload });
                socket.emit('task modal', task);
                socket.emit('tasks');
            })
            .catch(err => {
                dispatch({ type: t.EDIT_CLAIMS_FAILURE, payload: err });
            });
    };
}

/**
 * Add a task submission
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
        fetch(`/task/submissions/${category}`, {
            method: 'PUT',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(checkStatus)
            .then(() => {
                dispatch({ type: t.ADD_SUBMISSION_SUCCESS, payload });
                socket.emit('submissions', updatedTask);
            })
            .catch(err => {
                dispatch({ type: t.ADD_SUBMISSION_FAILURE, payload: err });
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
        fetch(`/task/submissions/${category}`, {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(checkStatus)
            .then(() => {
                dispatch({ type: t.DELETE_SUBMISSION_SUCCESS, payload });
                socket.emit('submissions', updatedTask);
            })
            .catch(err => {
                dispatch({ type: t.DELETE_SUBMISSION_FAILURE, payload: err });
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
        fetch(`/task/ownSubmission/${category}`, {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(checkStatus)
            .then(() => {
                dispatch({ type: t.DELETE_OWN_SUBMISSION_SUCCESS, payload });
                socket.emit('submissions', updatedTask);
            })
            .catch(err => {
                dispatch({ type: t.DELETE_OWN_SUBMISSION_FAILURE, payload: err });
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
        dispatch({ type: t.FETCH_SUBMISSIONS });
        fetch('/task/admin/submissions', {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then(checkStatus)
            .then(parseJSON)
            .then(tasks => {
                const submissions = submissionList(tasks);
                dispatch({ type: t.FETCH_SUBMISSIONS_SUCCESS, payload: submissions });
            })
            .catch(err => {
                dispatch({ type: t.FETCH_SUBMISSIONS_FAILURE, payload: err });
            });
    };
}