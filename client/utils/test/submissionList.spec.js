import chai from 'chai';
import submissionList from '../submissionList';
chai.should();

describe('submissionList()', function () {
    let tasks = [
        {
            name: 'testName',
            category: 'testCategory',
            archive: false,
            submissions: [
                {
                    date: new Date().getTime() - 3000,
                    username: 'testUser',
                    url: 'google.com'
                },
                {
                    date: new Date().getTime() - 1000,
                    username: 'testUser2',
                    url: 'google.com'
                },
            ]
        },
        {
            name: 'testName',
            category: 'testCategory',
            archive: false,
            submissions: [
                {
                    date: new Date().getTime() - 2000,
                    username: 'testUser',
                    url: 'google.com'
                },
                {
                    date: new Date().getTime(),
                    username: 'testUser2',
                    url: 'google.com'
                },
            ]
        }
    ];

    const submissions = submissionList(tasks);

    it('Return an array of submissions from the given tasks', function () {
        submissions.should.be.an('array');
        submissions[0].should.be.an('object')
            .that.has.all.keys('date', 'username', 'url', 'name', 'category', 'archive');
    });

    it('Should be ordered from newest to oldest', function () {
        for (let i = 0; i < submissions.length - 1; i++) {
            (submissions[i].date).should.be.at.least(submissions[i + 1].date);
        }
    });
});