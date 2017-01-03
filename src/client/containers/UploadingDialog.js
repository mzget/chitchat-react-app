"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const React = require("react");
const react_redux_1 = require("react-redux");
const reflexbox_1 = require("reflexbox");
const Dialog_1 = require("material-ui/Dialog");
const FlatButton_1 = require("material-ui/FlatButton");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const ChatroomRx = require("../redux/chatroom/chatroomRxEpic");
const SimpleCardImage_1 = require("../components/SimpleCardImage");
const CircularProgressSimple_1 = require("../components/CircularProgressSimple");
class IComponentNameProps {
}
;
;
class UploadingDialog extends React.Component {
    constructor() {
        super(...arguments);
        this.actions = [
            React.createElement(FlatButton_1.default, { label: "Cancel", primary: true, onTouchTap: () => this.setState(previousState => (__assign({}, previousState, { openState: false }))) })
        ];
    }
    componentWillMount() {
        this.state = {
            openState: false
        };
    }
    componentWillReceiveProps(nextProps) {
        let { chatroomReducer } = nextProps;
        switch (chatroomReducer.state) {
            case ChatroomRx.CHATROOM_UPLOAD_FILE:
                this.setState(previouseState => (__assign({}, previouseState, { openState: true })));
                break;
            default:
                break;
        }
    }
    render() {
        let { chatroomReducer } = this.props;
        return (React.createElement(MuiThemeProvider_1.default, null,
            React.createElement(Dialog_1.default, { title: "Uploading...", actions: this.actions, modal: true, open: this.state.openState },
                React.createElement(SimpleCardImage_1.default, { src: chatroomReducer.uploadingFile }),
                React.createElement(reflexbox_1.Flex, { p: 2, align: 'center' },
                    React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true }),
                    React.createElement(CircularProgressSimple_1.default, null),
                    React.createElement(reflexbox_1.Box, { p: 2, flexAuto: true })))));
    }
}
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return __assign({}, state);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(UploadingDialog);
