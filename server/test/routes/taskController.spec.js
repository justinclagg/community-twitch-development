const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
require('sinon-as-promised');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const redis = require('redis-mock');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();
sinon.stub(require('redis'), 'createClient').returns(redisClient);

const Task = require('../../models/Task.js');
const cache = require('../../utils/cache.js');
const factories = require('../factories.js');
const taskController = require('../../routes/task/taskController.js');

describe('Task Routes', function () {

	describe('getAllInCategory()', function () {

		let statusSpy, sendSpy, getAsyncStub, setAsyncStub;
		let request, response;

		beforeEach(function () {
			request = factories.request();
			response = factories.response();
			statusSpy = sinon.spy(response, 'status');
			sendSpy = sinon.spy(response, 'send');
			getAsyncStub = sinon.stub(redisClient, 'getAsync');		
			setAsyncStub = sinon.stub(redisClient, 'setAsync');		
		});

		afterEach(function () {
			statusSpy.restore();
			sendSpy.restore();
			getAsyncStub.restore();
			setAsyncStub.restore();
		});

		it('should get cached tasks from a category if available', function () {
			const cachedTasks = JSON.stringify([factories.existingTask()]);
			getAsyncStub.resolves(cachedTasks);
			return taskController.getAllInCategory()(request, response)
				.then(() => {
					expect(statusSpy).to.be.calledOnce.calledWithExactly(200);
					expect(sendSpy).to.be.calledOnce.calledWithExactly(JSON.parse(cachedTasks));
				});
		});

		it('gets tasks from database and caches if no cache found', function () {
			const existingTask = factories.existingTask();
			getAsyncStub.resolves();
			const getTasksInCategoryStub = sinon.stub(Task, 'getTasksInCategory');
			getTasksInCategoryStub.resolves([ existingTask ]);

			return taskController.getAllInCategory()(request, response)
				.then(() => {
					expect(getTasksInCategoryStub).to.be.calledOnce.calledWithExactly(request.params.category);
					expect(setAsyncStub).to.be.calledWithExactly(request.params.category, JSON.stringify([ existingTask ]));
					expect(statusSpy).to.be.calledOnce.calledWithExactly(200);
					expect(sendSpy).to.be.calledOnce.calledWithExactly([ existingTask ]);							
				});
		});

		it('should handle errors and send a response', function () {
			const testError = new Error('test');
			getAsyncStub.rejects(testError);

			return taskController.getAllInCategory()(request, response)
				.then().catch(err => {
					expect(err).to.equal(testError);
					expect(statusSpy).to.be.calledOnce.calledWithExactly(500);
					expect(sendSpy).to.be.calledOnce.calledWithExactly(`Error getting tasks - ${testError.message}`);
				});
		});

	});

	describe('add()', function () {

		let createStub, statusSpy, sendSpy, cacheTasksStub;
		let request, response;

		beforeEach(function () {
			request = factories.request();
			response = factories.response();
			createStub = sinon.stub(Task, 'createAndSave');
			statusSpy = sinon.spy(response, 'status');
			sendSpy = sinon.spy(response, 'send');
		});

		afterEach(function () {
			createStub.restore();
			statusSpy.restore();
			sendSpy.restore();
		});

		after(function () {
			cacheTasksStub.restore();
		});

		it('should save a new task and cache tasks', function () {
			const existingTask = factories.existingTask();
			createStub.resolves(existingTask);
			cacheTasksStub = sinon.stub(cache, 'tasks');

			return taskController.add()(request, response)
				.then(() => {
					expect(statusSpy).to.be.calledOnce.calledWithExactly(201);
					expect(sendSpy).to.be.calledOnce.calledWithExactly(existingTask);
					expect(cacheTasksStub).to.be.calledOnce;
				});
		});

		it('should handle errors and send a response', function () {
			const testError = new Error('test');
			createStub.rejects(testError);

			return taskController.add()(request, response)
				.then().catch(err => {
					expect(err).to.equal(testError);
					expect(statusSpy).to.be.calledOnce.calledWithExactly(500);
					expect(sendSpy).to.be.calledOnce.calledWithExactly(`Error posting task - ${testError.message}`);
				});
		});

	});
});