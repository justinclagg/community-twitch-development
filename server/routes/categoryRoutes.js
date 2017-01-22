const Task = require('../models/taskSchema.js');
const requireRole = require('../middleware/requireRole.js');
const cacheCategories = require('../utils/cacheCategories.js');
const cacheTasks = require('../utils/cacheTasks.js');

module.exports = (cache, app) => {

	app.route('/live/categories')
		// Get a list of categories
		.get((req, res) => {
			cache.getAsync('categoryList')
				.then(result => {
					if (result) {
						res.status(200).send(result.split(','));
					}
					else {
						cacheCategories(cache);
						res.status(200).send();
					}
				})
				.catch(err => {
					res.status(500).send(`Error getting categories - ${err}`);					
				});
		})
		// Add a new category
		.post(
			requireRole('admin'),
			(req, res) => {
				Task.findOne({ name: req.body.category, category: null })
					.then(category => {
						if (category) throw new Error('Category already exists');
					})
					.then(() => {
						// New category, store in database and cache
						let newCategory = new Task();
						newCategory.name = req.body.category;
						newCategory.category = null;
						return newCategory.save();
					})
					.then(() => {
						res.status(201).send();
						cacheCategories(cache);
					})
					.catch(err => {
						res.status(500).send(`Error adding category - ${err}`);
					});
			}
		)
		// Delete a category
		.delete(
			requireRole('admin'),
			(req, res) => {
				Promise.all([
					Task.remove({ category: req.body.category }),
					Task.findOneAndRemove({ name: req.body.category, category: null })
				]).then(() => {
					res.status(200).send();
					cacheCategories(cache);
					cacheTasks(cache, req.body.category);
				})
				.catch(err => {
					res.status(500).send(`Error deleting category - ${err}`);					
				});
			}
		);
};