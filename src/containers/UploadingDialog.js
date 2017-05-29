"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var React = require("react");
var react_redux_1 = require("react-redux");
var reflexbox_1 = require("reflexbox");
var Dialog_1 = require("material-ui/Dialog");
var FlatButton_1 = require("material-ui/FlatButton");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var ChatroomRx = require("../chitchat/chats/redux/chatroom/chatroomRxEpic");
var SimpleCardImage_1 = require("../components/SimpleCardImage");
var SimpleCardVideo_1 = require("../components/SimpleCardVideo");
var LinearProgressSimple_1 = require("../components/LinearProgressSimple");
var FileType = require("../chitchat/shared/FileType");
;
var UploadingDialog = (function (_super) {
    __extends(UploadingDialog, _super);
    function UploadingDialog() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.closeDialog = function () {
            _this.setState(function (previouseState) { return (__assign({}, previouseState, { openState: false })); });
        };
        _this.cancelFileUpload = function () {
            var chatroomReducer = _this.props.chatroomReducer;
            if (chatroomReducer.state == ChatroomRx.CHATROOM_UPLOAD_FILE) {
                _this.props.dispatch(ChatroomRx.uploadFileCanceled());
            }
            _this.closeDialog();
        };
        return _this;
    }
    UploadingDialog.prototype.componentWillMount = function () {
        this.state = {
            dialogTitle: "Uploading...",
            openState: false,
            closeLabel: "Cancel"
        };
        this.closeDialog = this.closeDialog.bind(this);
    };
    UploadingDialog.prototype.componentWillReceiveProps = function (nextProps) {
        var chatroomReducer = nextProps.chatroomReducer;
        var self = this;
        switch (chatroomReducer.state) {
            case ChatroomRx.CHATROOM_UPLOAD_FILE:
                this.setState(function (previouseState) { return (__assign({}, previouseState, { openState: true })); });
                break;
            case ChatroomRx.CHATROOM_UPLOAD_FILE_SUCCESS: {
                this.setState(function (previouseState) { return (__assign({}, previouseState, { dialogTitle: "Upload Success!" })); });
                setTimeout(function () {
                    self.closeDialog();
                }, 3000);
                break;
            }
            case ChatroomRx.CHATROOM_UPLOAD_FILE_FAILURE: {
                this.setState(function (previouseState) { return (__assign({}, previouseState, { dialogTitle: "Upload Fail!" })); });
                setTimeout(function () {
                    self.closeDialog();
                }, 3000);
                break;
            }
            default:
                break;
        }
    };
    UploadingDialog.prototype.render = function () {
        var chatroomReducer = this.props.chatroomReducer;
        var actions = [
            React.createElement(FlatButton_1["default"], { label: this.state.closeLabel, primary: true, onClick: this.cancelFileUpload })
        ];
        var getMediaCard = function () {
            if (chatroomReducer.fileInfo.type.match(FileType.imageType)) {
                return (React.createElement(SimpleCardImage_1["default"], { src: chatroomReducer.uploadingFile }));
            }
            else if (chatroomReducer.fileInfo.type.match(FileType.textType)) {
                return null;
            }
            else if (chatroomReducer.fileInfo.type.match(FileType.videoType)) {
                return (React.createElement(SimpleCardVideo_1["default"], { src: chatroomReducer.uploadingFile }));
            }
        };
        return (React.createElement(MuiThemeProvider_1["default"], null,
            React.createElement(Dialog_1["default"], { title: this.state.dialogTitle, actions: actions, modal: true, open: this.state.openState },
                (this.state.openState) ?
                    getMediaCard() : null,
                React.createElement(reflexbox_1.Flex, { p: 2, align: "center" },
                    React.createElement(LinearProgressSimple_1["default"], null)))));
    };
    return UploadingDialog;
}(React.Component));
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return __assign({}, state);
}
exports.__esModule = true;
exports["default"] = react_redux_1.connect(mapStateToProps)(UploadingDialog);
