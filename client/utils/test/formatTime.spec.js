const assert = require('chai').assert;
import { getLocalTime, getLocalDate } from '../formatTime';

describe('formatTime()', function () {
	it('Return the formatted time', function () {
		const date = new Date(1993, 5, 27, 1, 10);
		const test = getLocalTime(date);
		const expected = '1:10 am';
		assert.equal(test, expected);
	});
	it('Return the formatted date', function () {
		const date = new Date(1993, 5, 27);
		const test = getLocalDate(date);
		const expected = '5 / 27';
		assert.equal(test, expected);
	});
});