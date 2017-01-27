import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../';
import Task from '../../models/Task';

chai.use(chaiHttp);

/* Integration test for task routes */

// tasks need to exist before deleting or editing

describe('Task routes', function () {
	this.timeout(0);
	const newTask = {
		category: 'Test category',
		name: 'name',
		description: 'description',
		claims: [],
		submissions: [],
		archive: false
	};
	const existingTask = {...newTask, _id: '1'};
	const { category } = newTask;
	const adminUser = { role: 'admin' };
	const subscriberUser = { role: 'subscriber' };
	const memberUser = { role: 'member' };

	const taskRoute = `/task/${category}`;

	beforeEach(function(done) {
		server.request.user = {};
		Task.remove({}, (err) => done(err));
	});

	describe('GET tasks', function () { // Not working as expected. Add some tasks by default for tests?
		it('should get all tasks within a category', function (done) {
			chai.request(server)
				.get(taskRoute)
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('array');
					done();
				});
		});
	});

	describe('POST task', function () {
		it('should post a task and receive that task with an _id', function (done) {
			server.request.user = adminUser;
			chai.request(server)
				.post(taskRoute)
				.send(newTask)
				.end((err, res) => {
					expect(res).to.have.status(201);
					expect(res.body).to.be.an('object')
						.that.contains.all.keys(newTask)
						.and.contains.all.keys('_id'); // Task is added and given an _id by MongoDB
					done();
				});
		});

		it('rejects posts from non-admins', function (done) {
			server.request.user = subscriberUser;			
			chai.request(server)
				.post(taskRoute)
				.send(newTask)
				.end((err, res) => {
					expect(res).to.have.status(403);
					done();
				});
		});
	});

	describe('DELETE task', function () {
		it('should delete a task', function (done) {
			server.request.user = adminUser;
			chai.request(server)
				.delete(taskRoute)
				.send(existingTask._id)
				.end((err, res) => {
					expect(res).to.have.status(201);
					expect(res.body).to.deep.equal({});
					done();
				});
		});

		it('rejects deletions from non-admins', function (done) {
			server.request.user = subscriberUser;			
			chai.request(server)
				.delete(taskRoute)
				.send(existingTask._id)
				.end((err, res) => {
					expect(res).to.have.status(403);
					done();
				});
		});
	});
	
	// describe('EDIT task', function () {
	// 	it('should edit a task', function (done) {
	// 		server.request.user = adminUser;
	// 		chai.request(server)
	// 			.put(taskRoute)
	// 			.send(existingTask)
	// 			.end((err, res) => {
	// 				expect(res).to.have.status(201);
	// 				expect(res.body).to.deep.equal({});
	// 				done();
	// 			});
	// 	});

	// 	it('rejects edits from non-admins', function (done) {
	// 		server.request.user = subscriberUser;			
	// 		chai.request(server)
	// 			.put(taskRoute)
	// 			.send(existingTask)
	// 			.end((err, res) => {
	// 				expect(res).to.have.status(403);
	// 				done();
	// 			});
	// 	});
	// });







});