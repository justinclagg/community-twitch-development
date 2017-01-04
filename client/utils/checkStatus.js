/**
 * Check the server response, and throw an error if it is not in the 200-299 status range
 * 
 * @param {object} response
 * @returns {object}
 */

export default function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}
	else {
		const error = new Error(response.statusText);
		error.response = response;
		throw error;
	}
}