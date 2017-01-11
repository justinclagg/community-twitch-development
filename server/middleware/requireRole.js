/**
 * Middleware requiring that the user has an appropriate access level
 * 
 * @param {string} role - Minimum required access level to use endpoint
 */

module.exports = function requireRole(requiredRole) {
	return (req, res, next) => {
		if (req.user) {
			const userRole = req.user.role;
			if (userRole === requiredRole) {
				return next();
			}
			else if (requiredRole === 'subscriber' && userRole === 'admin') {
				return next();
			}
			else if (requiredRole === 'member' && (userRole === 'subscriber' || userRole === 'admin')) {
				return next();
			}
		}
		return res.status(403).send();
	};
};