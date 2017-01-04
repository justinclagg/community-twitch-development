import { expect } from 'mocha';
import cacheTasks from '../../server/utils/cacheTasks';
import taskSchema from '../../server/models/taskSchema';

describe('cacheTasks()', function() {
	it('should get all tasks in a category from database and cache them', function() {
		const category = 'Test category';
		// cacheTasks(cache, category, res, task);
		// cache should set tasks to category
		// return 201 and tasks if given res
	});
});