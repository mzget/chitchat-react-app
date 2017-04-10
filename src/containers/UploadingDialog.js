"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const reflexbox_1 = require("reflexbox");
const Dialog_1 = require("material-ui/Dialog");
const FlatButton_1 = require("material-ui/FlatButton");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const ChatroomRx = require("../chitchat/chats/redux/chatroom/chatroomRxEpic");
const SimpleCardImage_1 = require("../components/SimpleCardImage");
const SimpleCardVideo_1 = require("../components/SimpleCardVideo");
const LinearProgressSimple_1 = require("../components/LinearProgressSimple");
const FileType = require("../chitchat/libs/shared/FileType");
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
            React.createElement(FlatButton_1.default, { label: this.state.closeLabel, primary: true, onClick: this.cancelFileUpload })
        ];
        const getMediaCard = () => {
            if (chatroomReducer.fileInfo.type.match(FileType.imageType)) {
                return (React.createElement(SimpleCardImage_1.default, { src: chatroomReducer.uploadingFile }));
            }
            else if (chatroomReducer.fileInfo.type.match(FileType.textType)) {
                return null;
            }
            else if (chatroomReducer.fileInfo.type.match(FileType.videoType)) {
                return (React.createElement(SimpleCardVideo_1.default, { src: chatroomReducer.uploadingFile }));
            }
        };
        return (React.createElement(MuiThemeProvider_1.default, null,
            React.createElement(Dialog_1.default, { title: this.state.dialogTitle, actions: actions, modal: true, open: this.state.openState },
                (this.state.openState) ?
                    getMediaCard() : null,
                React.createElement(reflexbox_1.Flex, { p: 2, align: "center" },
                    React.createElement(LinearProgressSimple_1.default, null)))));
    }
}
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return Object.assign({}, state);
}
exports.default = react_redux_1.connect(mapStateToProps)(UploadingDialog);
