import React from 'react';

const Footer = () => {
	const year = new Date().getFullYear();
	return (
		<footer>
			<p>Hardly Difficult LLC &copy; {year}</p>
		</footer>
	);
};

export default Footer;