const Task = require('../models/taskSchema.js');

/**
 * Cache the categories list after a database change
 * 
 * @param {object} cache - Redis client
 * @param {object} [res] - Optional response to client
 */

module.exports = function cacheCategories(cache, res) {
	// Get all categories (task with category of null)
	Task.find({ category: null }, (err, categories) => {
		if (err) return console.log(`Database error getting categories: ${err}`);
		let categoryList = categories.map(category => category.name);
		cache.set('categoryList', categoryList.toString(), (err) => {
			if (err) return console.log(err);
			if (res) res.status(201).send(categoryList);
		});
	});
};