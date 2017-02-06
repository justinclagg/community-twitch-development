const { expect } = require('chai');
const sinon = require('sinon');

const factories = require('../factories');
const requireRole = require('../../middleware/requireRole');

describe('requireRole()', function () {

    it('should call next if user has access', function () {
        const request = factories.request();
        const response = factories.response();
        const next = sinon.spy();
        request.user.role = 'admin';

        requireRole('admin')(request, response, next);
        requireRole('subscriber')(request, response, next);
        requireRole('member')(request, response, next);

        expect(next.calledThrice).to.be.true;
    });

    it('should send status 403 if user does not have access', function () {
        const request = factories.request();
        const response = factories.response();
        const next = sinon.spy();
        const status = sinon.spy(response, 'status');
        request.user.role = 'member';

        requireRole('admin')(request, response, next);
        requireRole('subscriber')(request, response, next);

        expect(next.notCalled).to.be.true;
        expect(
            status.withArgs(403).calledTwice
        ).to.be.true;
    });
});