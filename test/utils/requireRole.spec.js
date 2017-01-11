import { expect } from 'chai';
import sinon from 'sinon';
import requireRole from '../../server/middleware/requireRole';

describe('requireRole()', function () {
	it('should call next if user has access', function () {
		const request = { user: { role: 'admin' } };
		const response = {};
		const nextSpy = sinon.spy();
		requireRole('admin')(request, response, nextSpy);
		requireRole('subscriber')(request, response, nextSpy);
		requireRole('member')(request, response, nextSpy);
		expect(nextSpy.calledThrice).to.be.true;
	});

	it('should send status 403 if user does not have access', function () {
		// const request = { user: { role: 'member' } };
		const request = {};
		const response = {
			status: function (responseStatus) {
				return this; // chainable function
			},
			send: function () {}
		};
		const statusSpy = sinon.spy(response, 'status');
		const nextSpy = sinon.spy();
		requireRole('admin')(request, response, nextSpy);
		requireRole('subscriber')(request, response, nextSpy);
		expect(nextSpy.notCalled).to.be.true;
		expect(statusSpy.withArgs(403).calledTwice).to.be.true;
	});
});