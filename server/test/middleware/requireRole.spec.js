const chai = require('chai');
const sinon = require('sinon');
chai.should();

const requireRole = require('../../middleware/requireRole');

describe('requireRole()', function () {
    it('should call next if user has access', function () {
        const request = { user: { role: 'admin' } };
        const response = {};
        const nextSpy = sinon.spy();
        
        requireRole('admin')(request, response, nextSpy);
        requireRole('subscriber')(request, response, nextSpy);
        requireRole('member')(request, response, nextSpy);
        nextSpy.calledThrice.should.be.true;
    });

    it('should send status 403 if user does not have access', function () {
        const request = { user: { role: 'member' } };
        const response = {
            status: function (responseStatus) {
                return this; // chainable function
            },
            send: function () { }
        };
        const statusSpy = sinon.spy(response, 'status');
        const nextSpy = sinon.spy();

        requireRole('admin')(request, response, nextSpy);
        requireRole('subscriber')(request, response, nextSpy);
        nextSpy.notCalled.should.be.true;
        statusSpy.withArgs(403).calledTwice.should.be.true;
    });
});