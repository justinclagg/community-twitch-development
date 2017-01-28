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
        const { category } = req.body;
        Task.getCategory(category)
            .then(category => {
                if (category) throw new Error('Category already exists');
            })
            .then(() => {
                // New category, store in database and cache
                return Task.createAndSave({ name: category, category: null });
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
        const { category } = req.body;
        Promise.all([
            Task.removeAllInCategory(category),
            Task.removeCategory(category)
        ])
            .then(() => {
                res.status(200).send();
                cache.categories();
                cache.tasks(category);
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