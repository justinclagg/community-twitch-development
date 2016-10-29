/**
 * Middleware requiring that the user has an appropriate access level
 * 
 * @param {string} role - Minimum required access level to use endpoint
 */

module.exports = function requireRole(role) {
	return (req, res, next) => {
		if (req.user.role === role) {
			next();
		}
		else if (role === 'subscriber' && req.user.role === 'admin') {
			next();
		}
		else if (role === 'member' && req.isAuthenticated()) {
			next();
		}
		else {
			res.redirect('/');
		}
	};
};