import React, { PropTypes, Component } from 'react';
import { withRouter } from 'react-router';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

class CategoryDropdown extends Component {

	onMenuClick(event, index, value) {
		this.props.router.push(`/contribute/${encodeURIComponent(value)}`);
	}

	render() {
		// Create a dropdown item for each category
		let CategoryList = this.props.categories.map((category, index) => {
			return <MenuItem value={category} primaryText={category} key={index} />;
		});

		return (
			<DropDownMenu
				value={this.props.category}
				onChange={this.onMenuClick.bind(this)}
				labelStyle={{ paddingLeft: 0, fontSize: '20px' }}
				underlineStyle={{ borderTop: 'none' }}
				>
				{CategoryList}
			</DropDownMenu>
		);
	}
}

export default withRouter(CategoryDropdown);

CategoryDropdown.propTypes = {
	categories: PropTypes.array.isRequired,
	category: PropTypes.string.isRequired,
	router: PropTypes.object.isRequired
};