import chai from 'chai';
import { getLocalTime, getLocalDate } from '../formatTime';
chai.should();

describe('formatTime()', function () {

    it('Return the formatted time', function () {
        const date = new Date(1993, 5, 27, 1, 10);
        const test = getLocalTime(date);
        const expected = '1:10 am';
        test.should.equal(expected);
    });
    
    it('Return the formatted date', function () {
        const date = new Date(1993, 5, 27);
        const test = getLocalDate(date);
        const expected = '5 / 27';
        test.should.equal(expected);        
    });
});