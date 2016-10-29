/**
 * Middleware requiring that the user is logged in
 */

module.exports = function authenticate() {
	return (req, res, next) => {
		if (req.isAuthenticated()) {
			next();
		}
		else {
			res.status(401).send();
		}
	};
};