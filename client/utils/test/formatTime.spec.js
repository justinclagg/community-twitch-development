import { expect } from 'chai';

import { getLocalTime, getLocalDate } from '../formatTime';

describe('formatTime()', function () {

    it('should return the formatted time', function () {
        const date = new Date(1993, 5, 27, 1, 10);
        const test = getLocalTime(date);
        const expected = '1:10 am';

        expect(test).to.equal(expected);
    });

    it('should return the formatted date', function () {
        const date = new Date(1993, 5, 27);
        const test = getLocalDate(date);
        const expected = '5 / 27';

        expect(test).to.equal(expected);
    });
});