import React, { Component, PropTypes } from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { deleteSubmission } from '../../actions';

class DeleteSubmissionModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            submission: {} // Submission to be deleted
        };
        this.toggleModal = this.toggleModal.bind(this);
    }


    toggleModal(submission) {
        if (!this.state.open) this.setState({ submission });
        this.setState((prevState) => {
            return { open: !prevState.open };
        });
    }

    deleteSubmission() {
        const { task, setSelectedTask, dispatch, socket } = this.props;
        const { submission } = this.state;
        const updatedSubmissions = task.submissions.filter(sub => sub !== submission);
        const updatedTask = { ...task, submissions: updatedSubmissions };

        setSelectedTask(updatedTask);
        dispatch(deleteSubmission(task, updatedSubmissions, updatedTask, socket));
        this.toggleModal();
    }

    render() {
        const { submission } = this.state;
        return (
            <Dialog
                title="Delete Submission"
                actions={[
                    <FlatButton label="Delete" onTouchTap={this.deleteSubmission.bind(this)} secondary={true} />,
                    <FlatButton label="Cancel" onTouchTap={this.toggleModal} />
                ]}
                modal={false}
                open={this.state.open}
                onRequestClose={this.toggleModal}
                className="admin-modal"
                contentStyle={{ width: '100%' }}
                >
                <p>Delete submission by {submission.username} with URL: {submission.url}?</p>
            </Dialog>
        );
    }
}

DeleteSubmissionModal.propTypes = {
    dispatch: PropTypes.func.isRequired,
    socket: PropTypes.object.isRequired,
    task: PropTypes.object.isRequired,
    setSelectedTask: PropTypes.func.isRequired
};

export default DeleteSubmissionModal;