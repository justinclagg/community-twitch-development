const chai = require('chai');
const assert = chai.assert;
const parseKey = require('../../utils/parseDotenv').parseKey;

describe('parseDotenv()', function () {
    it('Case sensitive variables', function () {
        const key = 'TWITCH_STREAMER';
        const value = 'jClagg';
        const test = parseKey(key, value);
        const expected = 'jclagg';
        assert.equal(test, expected);
    });
    it('Case sensitive arrays', function () {
        const key = 'ADDITIONAL_ADMINS';
        const value = 'jClagg, JCLAGG,jClAgG';
        const test = parseKey(key, value);
        const expected = ['jclagg', 'jclagg', 'jclagg'];
        assert.deepEqual(test, expected);
    });
    it('Case insensitive arrays', function () {
        const key = 'TEST';
        const value = 'A, b,C';
        const test = parseKey(key, value);
        const expected = ['A', 'b', 'C'];
        assert.deepEqual(test, expected);
    });
});