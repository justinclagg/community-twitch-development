import React, { Component, PropTypes } from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import { addCategory } from '../../taskActions.js';

export default class AddCategoryModal extends Component {

	constructor() {
		super();
		this.state = {
			open: false,
			error: null
		};
	}

	toggleModal() {
		this.setState({
			open: !this.state.open,
			error: null
		});
	}

	checkForSubmit(event) {
		if (event.keyCode === 13) {
			// Submit on enter
			this.addCategory();
		}
	}

	addCategory() {
		const { dispatch, socket } = this.props;
		const category = this.CategoryField.input.value;

		if (!category || /,/g.test(category)) {
			// Don't allow category names that are empty or contain commas (commas break category list parsing from cache)
			this.setState({ error: 'Invalid category name' });
			return;
		}
		
		dispatch(addCategory(category, socket));
		this.toggleModal();
	}

	render() {
		return (
			<Dialog
				title="Add Category"
				actions={[
					<FlatButton label="Add" onTouchTap={this.addCategory.bind(this)} primary={true} />,
					<FlatButton label="Cancel" onTouchTap={this.toggleModal.bind(this)} />
				]}
				modal={false}
				open={this.state.open}
				onRequestClose={this.toggleModal.bind(this)}
				className="admin-modal"
				contentStyle={{ width: '100%' }}
				>
				<TextField
					ref={ref => this.CategoryField = ref}
					hintText="Category Name"
					errorText={this.state.error}
					name="category"
					onKeyDown={this.checkForSubmit.bind(this)}
					autoComplete="off"
					autoFocus
					/>
			</Dialog>
		);
	}
}

AddCategoryModal.propTypes = {
	dispatch: PropTypes.func.isRequired,
	socket: PropTypes.object.isRequired
};