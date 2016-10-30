import React from 'react';

const Footer = () => {
	const year = new Date().getFullYear();
	return (
		<footer>
			<p>Community Twitch Development &copy; {year}</p>
		</footer>
	);
};

export default Footer;