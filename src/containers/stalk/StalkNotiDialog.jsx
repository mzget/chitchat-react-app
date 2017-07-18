import * as React from 'react';
import { connect } from "react-redux";
import { shallowEqual } from "recompose";
import { withRouter } from "react-router-dom";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
class StalkNotiDialogModal extends React.Component {
    constructor(props) {
        super(props);
        this.handleOpen = () => {
            this.setState({ open: true });
        };
        this.handleClose = () => {
            this.setState({ open: false });
        };
        this.state = {
            open: false,
        };
        this.answerCall = this.answerCall.bind(this);
        this.rejectedCall = this.rejectedCall.bind(this);
    }
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
        let prevCall = this.props.stalkReducer.get("incommingCall");
        let nextCall = nextProps.stalkReducer.get("incommingCall");
        if (!!nextCall && !shallowEqual(prevCall, nextCall)) {
            this.handleOpen();
        }
    }
    rejectedCall() {
        this.handleClose();
    }
    answerCall() {
        this.handleClose();
        let { room_id } = this.props.stalkReducer.get("incommingCall");
        this.props.history.push(`/videocall/${room_id}`);
    }
    render() {
        const actions = [
            <FlatButton label="Cancel" primary={true} onTouchTap={this.rejectedCall}/>,
            <FlatButton label="Answer" primary={true} onTouchTap={this.answerCall}/>,
        ];
        return (<MuiThemeProvider>
                <div>
                    <Dialog title="Dialog With Actions" actions={actions} modal={true} open={this.state.open}>
                        Only actions can close this dialog.
                 </Dialog>
                </div>
            </MuiThemeProvider>);
    }
}
const mapStateToProps = (state) => ({
    stalkReducer: state.stalkReducer
});
export var StalkNotiDialog = connect(mapStateToProps)(StalkNotiDialogModal);
StalkNotiDialog = withRouter(StalkNotiDialog);
