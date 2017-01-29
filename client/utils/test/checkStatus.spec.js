import chai from 'chai';
import checkStatus from '../checkStatus';
chai.should();

describe('checkStatus()', function () {

    it('Return the server response if status is 200-299', function () {
        const lowerBound = { status: 200 };
        const upperBound = { status: 299 };
        checkStatus(lowerBound).should.deep.equal(lowerBound);
        checkStatus(upperBound).should.deep.equal(upperBound);
    });
    
    it('Throw error if status is outside 200-299 range', function () {
        (() => checkStatus({ status: 199 })).should.throw(Error);
        (() => checkStatus({ status: 300 })).should.throw(Error);
    });
});