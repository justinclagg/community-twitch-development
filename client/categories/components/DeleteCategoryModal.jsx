import React, { Component, PropTypes } from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { deleteCategory } from '../actions';

class DeleteCategoryModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            category: '' // Category to be deleted
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
    }

    toggleModal(category) {
        if (!this.state.open) { this.setState({ category }); }
        this.setState((prevState) => {
            return { open: !prevState.open };
        });
    }

    deleteCategory() {
        this.props.dispatch(deleteCategory(this.state.category, this.props.socket));
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
                        onTouchTap={this.deleteCategory}
                        />,
                    <FlatButton
                        label="Cancel"
                        onTouchTap={this.toggleModal}
                        />
                ]}
                modal={false}
                open={this.state.open}
                onRequestClose={this.toggleModal}
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

export default DeleteCategoryModal;