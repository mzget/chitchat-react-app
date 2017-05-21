var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from "react";
import { connect } from "react-redux";
import { Flex } from "reflexbox";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as ChatroomRx from "../chitchat/chats/redux/chatroom/chatroomRxEpic";
import SimpleCardImage from "../components/SimpleCardImage";
import SimpleCardVideo from "../components/SimpleCardVideo";
import LinearProgressSimple from "../components/LinearProgressSimple";
import * as FileType from "../chitchat/libs/shared/FileType";
;
class UploadingDialog extends React.Component {
    constructor() {
        super(...arguments);
        this.closeDialog = () => {
            this.setState(previouseState => (__assign({}, previouseState, { openState: false })));
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
                this.setState(previouseState => (__assign({}, previouseState, { openState: true })));
                break;
            case ChatroomRx.CHATROOM_UPLOAD_FILE_SUCCESS: {
                this.setState(previouseState => (__assign({}, previouseState, { dialogTitle: "Upload Success!" })));
                setTimeout(function () {
                    self.closeDialog();
                }, 3000);
                break;
            }
            case ChatroomRx.CHATROOM_UPLOAD_FILE_FAILURE: {
                this.setState(previouseState => (__assign({}, previouseState, { dialogTitle: "Upload Fail!" })));
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
            React.createElement(FlatButton, { label: this.state.closeLabel, primary: true, onClick: this.cancelFileUpload })
        ];
        const getMediaCard = () => {
            if (chatroomReducer.fileInfo.type.match(FileType.imageType)) {
                return (React.createElement(SimpleCardImage, { src: chatroomReducer.uploadingFile }));
            }
            else if (chatroomReducer.fileInfo.type.match(FileType.textType)) {
                return null;
            }
            else if (chatroomReducer.fileInfo.type.match(FileType.videoType)) {
                return (React.createElement(SimpleCardVideo, { src: chatroomReducer.uploadingFile }));
            }
        };
        return (React.createElement(MuiThemeProvider, null,
            React.createElement(Dialog, { title: this.state.dialogTitle, actions: actions, modal: true, open: this.state.openState },
                (this.state.openState) ?
                    getMediaCard() : null,
                React.createElement(Flex, { p: 2, align: "center" },
                    React.createElement(LinearProgressSimple, null)))));
    }
}
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return __assign({}, state);
}
export default connect(mapStateToProps)(UploadingDialog);
