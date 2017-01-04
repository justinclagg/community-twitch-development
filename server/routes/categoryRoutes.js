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
			(req, res, next) => {
				Task.findOne({ name: req.body.category, category: null }, (err, category) => {
					if (err) {
						res.status(500).send(`Database error adding category: ${err}`);						
					}
					else if (category) {
						res.status(500).send('Category already exists');
					}
					else {
						// New category, store in database and cache
						let newCategory = new Task();
						newCategory.name = req.body.category;
						newCategory.category = null;
						newCategory.save(err => {
							if (err) return next(err);
							cacheCategories(cache, res);
						});
					}
				});
			}
		)
		// Delete a category
		.delete(
			requireRole('admin'),
			(req, res, next) => {
				// Delete all tasks within category
				Task.remove({ category: req.body.category }, (err) => {
					if (err) return next(err);
					cacheTasks(cache, req.body.category);
				});
				// Delete category
				Task.findOneAndRemove({ name: req.body.category, category: null }, (err) => {
					if (err) return next(err);
					cacheCategories(cache, res);
				});
			}
		);


};