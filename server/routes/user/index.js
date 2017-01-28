const router = require('express').Router();
const authenticate = require('../../middleware/authenticate.js');
const requireRole = require('../../middleware/requireRole.js');
const user = require('./userController.js');

/* User Login */

router.get('/auth/twitch', user.login());

router.get('/auth/twitch/callback', user.handleTwitchCallback());

router.post('/auth/checkLogin',
    authenticate(),
    user.sendProfile()
);

/* User Logout */

router.post('/auth/logout',
    authenticate(),
    user.logout()
);

/* Gitlab */

router.get('/auth/gitlab',
    requireRole(process.env.GITLAB_ACCESS_LEVEL),
    user.linkGitlab()
);

router.get('/auth/gitlab/callback',
    user.handleGitlabCallback()
);

router.post('/auth/gitlab/unlink',
    requireRole(process.env.GITLAB_ACCESS_LEVEL),
    user.unlinkGitlab()
);

module.exports = router;