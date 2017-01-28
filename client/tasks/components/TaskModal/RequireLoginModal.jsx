import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class RequireLoginModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    toggleModal() {
        this.setState((prevState) => {
            return { open: !prevState.open };
        });
    }

    render() {
        return (
            <Dialog
                modal={false}
                open={this.state.open}
                onRequestClose={this.toggleModal.bind(this)}
                actions={[<FlatButton label="Close" onTouchTap={this.toggleModal.bind(this)} />]}
                className="task-modal"
                contentStyle={{ width: '100%' }}
                >
                <p>Please log in to claim a task.</p>
            </Dialog>
        );
    }
}

export default RequireLoginModal;