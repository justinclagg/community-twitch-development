const Task = require('../models/taskSchema.js');
const requireRole = require('../middleware/requireRole.js');
const cacheCategories = require('../utils/cacheCategories.js');
const cacheTasks = require('../utils/cacheTasks.js');

module.exports = (cache, app) => {

	app.route('/live/categories')
		// Get a list of categories
		.get((req, res) => {
			cache.get('categoryList', (err, result) => {
				if (result) {
					res.status(200).send(result.split(','));
				}
				else {
					cacheCategories(cache, res);
				}
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
						newCategory.save()
							.then(() => cacheCategories(cache, res));
					})
					.catch(err => {
						res.status(500).send(`Error adding category - ${err}`);
					});
			}
		)
		// Delete a category
		.delete(
			requireRole('admin'),
			(req, res, next) => {
				// Delete all tasks within category
				Task.remove({ category: req.body.category })
					.then(() => cacheTasks(cache, req.body.category))
					.catch(err => {
						return next(err);
					});
				// Delete category
				Task.findOneAndRemove({ name: req.body.category, category: null })
					.then(() => cacheCategories(cache, res))
					.catch(err => {
						return next(err);
					});
			}
		);
};