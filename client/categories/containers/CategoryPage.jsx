import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { AddCategoryModal, DeleteCategoryModal } from '..';
import { LoadingSpinner } from '../../shared';

import { fetchCategories } from '../actions';

function mapStateToProps(store) {
	return {
		categories: store.categories.categories,
		fetchingCategories: store.categories.fetchingCategories
	};
}

class CategoryPage extends Component {

	constructor(props) {
		super(props);
		this.fetchCategories = () => props.dispatch(fetchCategories());
	}

	componentWillMount() {
		this.fetchCategories();
	}

	componentDidMount() {
		const { socket } = this.props;
		socket.on('categories', () => this.fetchCategories());
	}

	onCategoryClick(category) {
		this.props.router.push(`/contribute/${encodeURIComponent(category)}`);
	}

	onDeleteCategoryClick(category, event) {
		event.stopPropagation(); // Don't go to category page
		this.DeleteCategoryModal.toggleModal(category);
	}

	render() {
		const { profile, dispatch, categories, fetchingCategories, socket } = this.props;

		let CategoryCards = categories.map((category, index) => {
			return (
				<div className="category-card" onTouchTap={() => this.onCategoryClick(category)} key={index}>
					{category}
					{/* Admin delete category button */}
					{profile.role === 'admin' &&
						<div className="delete-category-btn" onTouchTap={(event) => this.onDeleteCategoryClick(category, event)}>x</div>
					}
				</div>
			);
		});

		// Admin add category button
		if (profile.role === 'admin') {
			CategoryCards.push(
				<div className="add-category-card" onTouchTap={() => this.AddCategoryModal.toggleModal()} key={'button'}>+</div>
			);
		}

		return (
			<div className="contribute-page">
				<h2 className="page-title">What would you like to help with?</h2>
				<div className="category-container">
					{CategoryCards}
				</div>
				{fetchingCategories &&
					<LoadingSpinner />
				}
				{/* Admin modals */}
				{profile.role === 'admin' &&
					<div>
						<AddCategoryModal
							ref={ref => this.AddCategoryModal = ref}
							dispatch={dispatch}
							socket={socket}
							/>
						<DeleteCategoryModal
							ref={ref => this.DeleteCategoryModal = ref}
							dispatch={dispatch}
							socket={socket}
							/>
					</div>
				}
			</div>
		);
	}
}


CategoryPage.propTypes = {
	dispatch: PropTypes.func.isRequired,
	socket: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
	categories: PropTypes.array.isRequired,
	fetchingCategories: PropTypes.bool.isRequired,
	router: PropTypes.object.isRequired
};

export default withRouter(connect(mapStateToProps)(CategoryPage));