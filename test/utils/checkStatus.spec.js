import { expect } from 'chai';
import checkStatus from '../../client/utils/checkStatus';

describe('Check server response status', function() {
	it('Return the server response if status is 200-299', function() {
		const lowerBound = { status: 200 };
		const upperBound = { status: 299 };
		expect(checkStatus(lowerBound)).to.deep.equal(lowerBound);
		expect(checkStatus(upperBound)).to.deep.equal(upperBound);
	});
	it('Throw error if status is outside 200-299 range', function() {
		expect(() => checkStatus({ status: 199 })).to.throw(Error);
		expect(() => checkStatus({ status: 300 })).to.throw(Error);
	});
});