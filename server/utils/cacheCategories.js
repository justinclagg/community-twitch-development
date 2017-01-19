const Task = require('../models/taskSchema.js');

/**
 * Cache the categories list after a database change
 * 
 * @param {object} cache - Redis client
 * @param {object} [res] - Optional response to client
 */

module.exports = function cacheCategories(cache, res) {
	// Get all categories (task with category of null)
	Task.find({ category: null })
		.then(categories => {
			let categoryList = categories.map(category => category.name);
			cache.set('categoryList', categoryList.toString(), (err) => {
				if (err) return console.log(err);
				if (res) res.status(201).send(categoryList);
			});
		})
		.catch(err => {
			res.status(500).send(`Error caching categories - ${err}`);
		});
};