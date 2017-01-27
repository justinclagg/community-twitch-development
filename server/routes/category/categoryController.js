const Task = require('../../models/Task.js');
const redisClient = require('../../config/redisConfig.js');
const cache = require('../../utils/cache.js');

function getAll() {
	return (req, res) => {
		return redisClient.getAsync('categoryList')
			.then(result => {
				if (result) {
					res.status(200).send(result.split(','));
				}
				else {
					redisClient.categories(cache);
					res.status(200).send();
				}
			})
			.catch(err => {
				res.status(500).send(`Error getting categories - ${err}`);
			});
	};
}

// Add a new category
function add() {
	return (req, res) => {	
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
				cache.categories();
			})
			.catch(err => {
				res.status(500).send(`Error adding category - ${err}`);
			});
	};
}

function remove() {
	return (req, res) => {	
		Promise.all([
			Task.remove({ category: req.body.category }),
			Task.findOneAndRemove({ name: req.body.category, category: null })
		]).then(() => {
			res.status(200).send();
			cache.categories();
			cache.tasks(req.body.category);
		})
		.catch(err => {
			res.status(500).send(`Error deleting category - ${err}`);
		});
	};
}

module.exports = {
	getAll,
	add,
	remove
};