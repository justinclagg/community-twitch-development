require('isomorphic-fetch');
const User = require('../../models/User.js');
const passport = require('passport');

/* User Login */

function login() {
    return passport.authenticate('twitchtv');
}

function handleTwitchCallback() {
    return passport.authenticate('twitchtv', { successRedirect: '/', failureRedirect: '/' });
}

function sendProfile() {
    return (req, res) => {
        res.status(200).send(req.user);
    };
}

/* User Logout */

function logout() {
    return (req, res) => {
        req.logout();
        res.redirect('/');
    };
}

/* Gitlab */

function linkGitlab() {
    return passport.authenticate('gitlab', { scope: ['api'] });
}

function handleGitlabCallback() {
    return passport.authenticate('gitlab', { successRedirect: '/profile', failureRedirect: '/profile' });
}

function unlinkGitlab() {
    return (req, res) => {
        const { GITLAB_GROUP_ID, GITLAB_ACCESS_TOKEN } = process.env;
        fetch(`https://gitlab.com/api/v3/groups/${GITLAB_GROUP_ID}/members/${req.user.gitlabId}`, {
            method: 'DELETE',
            headers: { 'PRIVATE-TOKEN': GITLAB_ACCESS_TOKEN }
        })
            .then(response => {
                if (!response.ok) throw new Error(`Error connecting to Gitlab - ${response.statusText}`);
                return User.getUser(req.user._id);
            })
            .then(user => {
                if (!user) throw new Error('User not found');
                return user.unlinkGitlab();
            })
            .then(user => res.status(200).send(user))
            .catch(err => {
                res.status(500).send(`Error removing gitlab permissions - ${err}`);
            });
    };
}

module.exports = {
    login,
    handleTwitchCallback,
    sendProfile,
    logout,
    linkGitlab,
    handleGitlabCallback,
    unlinkGitlab
};