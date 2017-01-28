const router = require('express').Router();
const requireRole = require('../../middleware/requireRole.js');
const category = require('./categoryController.js');

router.route('/')
    // Get a list of categories
    .get(
        category.getAll()
    )
    // Add a new category
    .post(
        requireRole('admin'),
        category.add()
    )
    // Delete a category
    .delete(
        requireRole('admin'),
        category.remove()
    );

module.exports = router;