import * as React from "react";
import { connect } from "react-redux";
import Flexbox from "flexbox-react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as ChatroomRx from "../chitchat/chats/redux/chatroom/chatroomRxEpic";
import SimpleCardImage from "../components/SimpleCardImage";
import SimpleCardVideo from "../components/SimpleCardVideo";
import { LinearProgressSimple } from "../components/LinearProgressSimple";
import * as FileType from "../chitchat/shared/FileType";
;
class UploadingDialog extends React.Component {
    constructor() {
        super(...arguments);
        this.closeDialog = () => {
            this.setState(previouseState => (Object.assign({}, previouseState, { openState: false })));
        };
        this.cancelFileUpload = () => {
            let { chatroomReducer } = this.props;
            if (chatroomReducer.state == ChatroomRx.CHATROOM_UPLOAD_FILE) {
                this.props.dispatch(ChatroomRx.uploadFileCanceled());
            }
            this.closeDialog();
        };
    }
    componentWillMount() {
        this.state = {
            dialogTitle: "Uploading...",
            openState: false,
            closeLabel: "Cancel"
        };
        this.closeDialog = this.closeDialog.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let { chatroomReducer } = nextProps;
        let self = this;
        switch (chatroomReducer.state) {
            case ChatroomRx.CHATROOM_UPLOAD_FILE:
                this.setState(previouseState => (Object.assign({}, previouseState, { openState: true })));
                break;
            case ChatroomRx.CHATROOM_UPLOAD_FILE_SUCCESS: {
                this.setState(previouseState => (Object.assign({}, previouseState, { dialogTitle: "Upload Success!" })));
                setTimeout(function () {
                    self.closeDialog();
                }, 3000);
                break;
            }
            case ChatroomRx.CHATROOM_UPLOAD_FILE_FAILURE: {
                this.setState(previouseState => (Object.assign({}, previouseState, { dialogTitle: "Upload Fail!" })));
                setTimeout(function () {
                    self.closeDialog();
                }, 3000);
                break;
            }
            default:
                break;
        }
    }
    render() {
        let { chatroomReducer } = this.props;
        const actions = [
            <FlatButton label={this.state.closeLabel} primary={true} onClick={this.cancelFileUpload}/>
        ];
        const getMediaCard = () => {
            if (chatroomReducer.fileInfo.type.match(FileType.imageType)) {
                return (<SimpleCardImage src={chatroomReducer.uploadingFile}/>);
            }
            else if (chatroomReducer.fileInfo.type.match(FileType.textType)) {
                return null;
            }
            else if (chatroomReducer.fileInfo.type.match(FileType.videoType)) {
                return (<SimpleCardVideo src={chatroomReducer.uploadingFile}/>);
            }
        };
        return (<MuiThemeProvider>
                <Dialog title={this.state.dialogTitle} actions={actions} modal={true} open={this.state.openState}>
                    {(this.state.openState) ?
            getMediaCard() : null}
                    <Flexbox alignItems="center">
                        <LinearProgressSimple />
                    </Flexbox>
                </Dialog>
            </MuiThemeProvider>);
    }
}
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return Object.assign({}, state);
}
export default connect(mapStateToProps)(UploadingDialog);
