import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';
import Task from '../../server/models/taskSchema';

chai.use(chaiHttp);

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

	const taskRoute = `/live/tasks/${category}`;

	beforeEach(function(done) {
		server.request.user = {};
		Task.remove({}, (err) => done(err));
	});

	describe('GET tasks', function () {
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
		it('should post a task', function (done) {
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

		it('reject posts from non-admins', function (done) {
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
	});







});