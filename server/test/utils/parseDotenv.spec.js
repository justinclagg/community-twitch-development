const chai = require('chai');
const expect = chai.expect;
const parseKey = require('../../utils/parseDotenv').parseKey;

describe('parseDotenv()', function () {

    it('case sensitive variables should be lowercased', function () {
        const key = 'TWITCH_STREAMER';
        const value = 'jClagg';
        const expected = 'jclagg';

        const test = parseKey(key, value);

        expect(test).to.equal(expected);
    });

    it('case sensitive lists should be parsed to an array and lowercased', function () {
        const key = 'ADDITIONAL_ADMINS';
        const value = 'jClagg, JCLAGG,jClAgG';
        const expected = ['jclagg', 'jclagg', 'jclagg'];

        const test = parseKey(key, value);

        expect(test).to.deep.equal(expected);
    });

    it('case insensitive lists should be parsed to an array', function () {
        const key = 'TEST';
        const value = 'A, b,C';
        const expected = ['A', 'b', 'C'];

        const test = parseKey(key, value);

        expect(test).to.deep.equal(expected);
    });
});