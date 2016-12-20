import React from 'react';

const Footer = () => {
	const year = new Date().getFullYear();
	return (
		<footer>
			<p>Copyright &copy; {year} Community Twitch Development</p>
		</footer>
	);
};

export default Footer;