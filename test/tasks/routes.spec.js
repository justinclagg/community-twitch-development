import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';
import Task from '../../server/models/taskSchema';

chai.use(chaiHttp);

describe('Task routes', function () {
	this.timeout(0);
	const task = {
		category: 'Test category',
		name: 'name',
		description: 'description',
		claims: [],
		submissions: [],
		archive: false
	};
	const { category } = task;

	beforeEach(function(done) {
		Task.remove({}, (err) => done(err));
	});

	describe('GET tasks', function () {
		it('should get all tasks within a category', function (done) {
			chai.request(server)
				.get(`/live/tasks/${category}`)
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('array');
					done();
				});
		});
	});

	describe('POST task', function () {
		it('should post a task', function (done) {
			// TODO: This is testing server response but not posting of task
			server.request.user = { role: 'admin' };
			chai.request(server)
				.post(`/live/tasks/${category}`)
				.send(task)
				.end((err, res) => {
					expect(res).to.have.status(201);
					expect(res.body).to.be.an('object')
						.that.contains.all.keys(task)
						.and.contains.all.keys('_id');
					done();
				});
		});

		it('reject posts from non-admins', function (done) {
			server.request.user = { role: 'subscriber' };			
			chai.request(server)
				.post(`/live/tasks/${category}`)
				.send(task)
				.end((err, res) => {
					expect(res).to.have.status(403);
					done();
				});
		});
	});


});