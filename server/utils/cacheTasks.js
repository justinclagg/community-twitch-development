const Task = require('../models/taskSchema.js');

/**
 * Cache the tasks of a category list after a database change
 * 
 * @param {object} cache - Redis client
 * @param {string} category
 * @param {object} [res] - Optional response to client
 * @param {object} [task] - Optional added task
 */

module.exports = function cacheTasks(cache, category, res, task) {
	// Get all tasks in given category
	Task.find({ category }, (err, tasks) => {
		if (err) return console.log(`Database error getting tasks: ${err}`);
		cache.set(category, JSON.stringify(tasks), (err) => {
			if (err) return console.log(err);
			if (res) res.status(201).send(task);
		});
	});
};