import * as React from 'react';
import { connect } from "react-redux";
import { shallowEqual } from "recompose";
import { withRouter } from "react-router-dom";

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import * as utils from "../../utils/";
import * as calling from "../../chitchat/calling/";

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
class StalkNotiDialogModal extends React.Component<utils.IComponentProps, any> {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };

        this.answerCall = this.answerCall.bind(this);
        this.rejectedCall = this.rejectedCall.bind(this);
    }

    componentWillReceiveProps(nextProps: utils.IComponentProps) {
        let inLine = this.props.stalkReducer.get("inline");
        let prevCall = this.props.stalkReducer.get("incommingCall");
        let nextCall = nextProps.stalkReducer.get("incommingCall");
        if (!inLine && !!nextCall && !shallowEqual(prevCall, nextCall)) {
            this.handleOpen(null);
        }
        else {
            if (!!inLine && !!nextCall && (inLine != nextCall.room_id) && !shallowEqual(prevCall, nextCall)) {
                this.handleOpen(null);
            }
        }
    }

    rejectedCall() {
        let self = this;
        this.handleClose(() => {
            let { _id } = self.props.userReducer.user;
            let { room_id, user_id } = self.props.stalkReducer.get("incommingCall");
            self.props.dispatch(calling.hangupCallRequest({ target_ids: [user_id], user_id: _id }));
        });
    }

    answerCall() {
        let self = this;
        this.handleClose(() => {
            let { room_id } = self.props.stalkReducer.get("incommingCall");
            self.props.history.push(`/videocall/${room_id}`);
        });
    }

    handleOpen = (cb) => {
        if (!this.state.open) {
            this.setState({ open: true }, cb);
        }
    };

    handleClose = (cb) => {
        this.setState({ open: false }, cb);
    };

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.rejectedCall}
            />,
            <FlatButton
                label="Answer"
                primary={true}
                onTouchTap={this.answerCall}
            />,
        ];

        return (
            <MuiThemeProvider>
                <div>
                    <Dialog
                        title="Incomming Call!"
                        actions={actions}
                        modal={true}
                        open={this.state.open}
                    >
                        Incomming Call!
                 </Dialog>
                </div>
            </MuiThemeProvider>
        );
    }
}

const mapStateToProps = (state) => ({
    userReducer: state.userReducer,
    stalkReducer: state.stalkReducer
});
export var StalkNotiDialog = connect(mapStateToProps)(StalkNotiDialogModal);
StalkNotiDialog = withRouter<any>(StalkNotiDialog);