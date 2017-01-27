// import { expect } from 'chai';
// import sinon from 'sinon';
// import cacheTasks from '../../utils/cacheTasks';
// import Task from '../../models/Task';
// // import mongoose from 'mongoose';
// // mongoose.Promise = global.Promise;

// describe('cacheTasks()', function() {
// 	it('should get all tasks in a category from database and cache them', function() {
// 		const category = 'Test category';
// 		// const Task = {
// 		// 	find: function() {}
// 		// };
// 		const CacheMock = {
// 			set: sinon.spy()
// 		};
// 		const taskFindStub = sinon.stub(Task, 'find');
// 		// right now Task.find is stubbed, so cacheTasks is essentially empty
// 		// I would need to make the stub return a callback so that cache.set gets called
// 		// Probably makes more sense to use a mongodb mock rather than write myself
// 		// cacheTasks(CacheMock, category);
// 		// expect(taskFindStub.calledOnce).to.be.true;
// 		// expect(CacheMock.set.calledOnce).to.be.true;
// 	});
// });

// Broken because Task doesn't have promises without the server running?