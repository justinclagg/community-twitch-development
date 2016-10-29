import React, { Component, PropTypes } from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { deleteCategory } from '../../taskActions.js';

export default class DeleteCategoryModal extends Component {

	constructor() {
		super();
		this.state = {
			open: false,
			category: '' // Category to be deleted
		};
	}

	toggleModal(category) {
		const { open } = this.state;
		if (!open) { this.setState({ category }); }
		this.setState({ open: !open });
	}

	deleteCategory() {
		const { dispatch, socket } = this.props;
		dispatch(deleteCategory(this.state.category, socket));
		this.toggleModal();
	}

	render() {
		return (
			<Dialog
				title="Delete Category"
				actions={[
					<FlatButton
						label="Delete"
						secondary={true}
						onTouchTap={this.deleteCategory.bind(this)}
						/>,
					<FlatButton
						label="Cancel"
						onTouchTap={this.toggleModal.bind(this)}
						/>
				]}
				modal={false}
				open={this.state.open}
				onRequestClose={this.toggleModal.bind(this)}
				className="admin-modal"
				contentStyle={{ width: '100%' }}
				>
				<p>Warning: The <span>{this.state.category}</span> category and all of its tasks will be deleted.</p>
			</Dialog>
		);
	}
}

DeleteCategoryModal.propTypes = {
	dispatch: PropTypes.func.isRequired,
	socket: PropTypes.object.isRequired
};