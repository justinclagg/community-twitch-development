const Task = require('../models/Task.js');
const redisClient = require('../config/redisConfig.js');

/**
 * Cache the tasks of a category list after a database change
 * 
 * @param {object} cache - Redis client
 * @param {string} category
 * @param {object} [res] - Optional response to client
 * @param {object} [task] - Optional added task
 */

function tasks(category) {
    // Get all tasks in given category
    return Task.find({ category })
        .then(tasks => {
            return redisClient.setAsync(category, JSON.stringify(tasks));
        })
        .catch(err => {
            throw new Error(`Error caching tasks - ${err}`);
        });
}

/**
 * Cache the categories list after a database change
 * 
 * @param {object} cache - Redis client
 * @param {object} [res] - Optional response to client
 */

function categories() {
    // Get all categories (task with category of null)
    Task.find({ category: null })
        .then(categories => {
            let categoryList = categories.map(category => category.name);
            return redisClient.setAsync('categoryList', categoryList.toString());
        })
        .catch(err => {
            throw new Error(`Error caching categories - ${err}`);
        });
}

module.exports = {
    tasks,
    categories
};