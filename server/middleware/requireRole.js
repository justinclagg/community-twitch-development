/**
 * Middleware requiring that the user has an appropriate access level
 * 
 * @param {string} role - Minimum required access level to use endpoint
 */

module.exports = function requireRole(requiredRole) {
	return (req, res, next) => {
		const userRole = req.user.role;
		if (userRole === requiredRole) {
			next();
		}
		else if (requiredRole === 'subscriber' && userRole === 'admin') {
			next();
		}
		else if (requiredRole === 'member' && (userRole === 'subscriber' || userRole === 'admin')) {
			next();
		}
		else {
			res.status(403).send();
		}
	};
};