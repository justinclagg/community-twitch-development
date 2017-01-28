require('isomorphic-fetch');
const TwitchtvStrategy = require('passport-twitchtv').Strategy;
const GitLabStrategy = require('passport-gitlab2');
const User = require('../models/User.js');

module.exports = (passport) => {

    // Serialize the user id for session storage
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    // Find the user profile associated with id
    passport.deserializeUser((_id, done) => {
        User.findById(_id, (err, user) => {
            done(err, user);
        });
    });

    /* Twitch authentication */

    const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, BASE_URL } = process.env;

    passport.use(
        new TwitchtvStrategy({
            clientID: TWITCH_CLIENT_ID,
            clientSecret: TWITCH_CLIENT_SECRET,
            callbackURL: BASE_URL + '/user/auth/twitch/callback',
            scope: 'user_read user_subscriptions',
            force_verify: true
        },
            (accessToken, refreshToken, profile, done) => {
                // Check if user is subscribed
                fetch(`https://api.twitch.tv/kraken/users/${profile.username}/subscriptions/${process.env.TWITCH_STREAMER}`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/vnd.twitchtv.v3+json',
                        Authorization: `OAuth ${accessToken}`
                    }
                })
                    .then(response => {
                        // Assign user role
                        let currentUserRole = '';
                        if (profile.username === process.env.TWITCH_STREAMER
                            || process.env.ADDITIONAL_ADMINS.indexOf(profile.username) !== -1) {
                            currentUserRole = 'admin';
                        }
                        else if (response.status === 200
                            || process.env.ADDITIONAL_SUBSCRIBERS.indexOf(profile.username) !== -1) {
                            currentUserRole = 'subscriber';
                        }
                        else if (response.status === 404 || response.status === 422) {
                            currentUserRole = 'member';
                        }

                        // Save or update user
                        User.getUser(profile.id)
                            .then(user => {
                                if (user) {
                                    // Current user, update role if needed
                                    if (user.role !== currentUserRole) {
                                        user.updateRole(currentUserRole)
                                            .then(user => done(null, user));
                                    }
                                    else {
                                        done(null, user);
                                    }
                                }
                                else {
                                    // New user, store in database
                                    User.createAndSave({
                                        _id: profile.id,
                                        username: profile.displayName,
                                        email: profile.email,
                                        role: currentUserRole
                                    }).then(newUser => {
                                        done(null, newUser);
                                    });
                                }
                            });
                    })
                    .catch(err => done(err));
            })
    );

    /* Gitlab authentication */

    const { GITLAB_CLIENT_ID, GITLAB_CLIENT_SECRET, GITLAB_GROUP_ID, GITLAB_ACCESS_TOKEN  } = process.env;

    passport.use(
        new GitLabStrategy({
            clientID: GITLAB_CLIENT_ID,
            clientSecret: GITLAB_CLIENT_SECRET,
            callbackURL: BASE_URL + '/user/auth/gitlab/callback',
            passReqToCallback: true
        },
            (req, accessToken, refreshToken, profile, done) => {
                // Add user's Gitlab account to the group
                fetch(`https://gitlab.com/api/v3/groups/${GITLAB_GROUP_ID}/members?user_id=${profile.id}&access_level=20`, {
                    method: 'POST',
                    headers: { 'PRIVATE-TOKEN': GITLAB_ACCESS_TOKEN }
                })
                    .then(res => {
                        if (!(res.ok || res.status == 409)) return done(); // Status 409 means user is already in GitLab group
                        return User.getUser(req.user._id);
                    })
                    .then(user => {
                        if (user) {
                            user.linkGitlab(profile.id)
                                .then(user => done(null, user));
                        }
                    })
                    .catch(err => {
                        return done(err);
                    });
            })
    );
};