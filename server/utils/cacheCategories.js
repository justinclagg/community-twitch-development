const Task = require('../models/taskSchema.js');

/**
 * Cache the categories list after a database change
 * 
 * @param {object} cache - Redis client
 * @param {object} [res] - Optional response to client
 */

module.exports = function cacheCategories(cache) {
	// Get all categories (task with category of null)
	Task.find({ category: null })
		.then(categories => {
			let categoryList = categories.map(category => category.name);
			return cache.setAsync('categoryList', categoryList.toString());
		})
		.catch(err => {
			throw new Error(`Error caching categories - ${err}`);
		});
};