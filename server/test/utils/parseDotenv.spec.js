const chai = require('chai');
const parseKey = require('../../utils/parseDotenv').parseKey;
chai.should();

describe('parseDotenv()', function () {
    it('Case sensitive variables', function () {
        const key = 'TWITCH_STREAMER';
        const value = 'jClagg';
        const test = parseKey(key, value);
        const expected = 'jclagg';
        test.should.equal(expected);
    });
    it('Case sensitive arrays', function () {
        const key = 'ADDITIONAL_ADMINS';
        const value = 'jClagg, JCLAGG,jClAgG';
        const test = parseKey(key, value);
        const expected = ['jclagg', 'jclagg', 'jclagg'];
        test.should.deep.equal(expected);        
    });
    it('Case insensitive arrays', function () {
        const key = 'TEST';
        const value = 'A, b,C';
        const test = parseKey(key, value);
        const expected = ['A', 'b', 'C'];
        test.should.deep.equal(expected);        
    });
});