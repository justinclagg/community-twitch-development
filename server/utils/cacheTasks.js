const Task = require('../models/taskSchema.js');

/**
 * Cache the tasks of a category list after a database change
 * 
 * @param {object} cache - Redis client
 * @param {string} category
 * @param {object} [res] - Optional response to client
 * @param {object} [task] - Optional added task
 */

module.exports = function cacheTasks(cache, category) {
	// Get all tasks in given category
	Task.find({ category })
		.then(tasks => {
			return cache.setAsync(category, JSON.stringify(tasks));
		})
		.catch(err => {
			throw new Error(`Error caching tasks - ${err}`);
		});
};