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
const DialogBox_1 = require("../components/DialogBox");
const SnackbarSimple_1 = require("../components/SnackbarSimple");
const StalkBridgeActions = require("../redux/stalkBridge/stalkBridgeActions");
;
class UtilsBox extends React.Component {
    componentWillMount() {
        this.state = {
            openDialog: false,
            dialogTitle: "",
            dialogMessage: "",
            openSnackbar: false,
            snackbarMessage: "",
            snackbarClose: null
        };
        this.closeSnackbar = this.closeSnackbar.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let { chatroomReducer, chatlogReducer, userReducer, stalkReducer } = nextProps;
        switch (stalkReducer.state) {
            case StalkBridgeActions.STALK_INIT_FAILURE:
                /*     this.setState({
                         ...this.state,
                         openDialog: true,
                         dialogTitle: AlertMsg.stalkInitFail.title,
                         dialogMessage: AlertMsg.stalkInitFail.message
                     });
                  */
                break;
            default:
                break;
        }
        if (stalkReducer.notiMessage != this.props.stalkReducer.notiMessage) {
            this.setState(previousState => (__assign({}, previousState, { openSnackbar: true, snackbarMessage: stalkReducer.notiMessage })));
        }
    }
    closeSnackbar(reason) {
        this.setState(previousState => (__assign({}, previousState, { openSnackbar: false })));
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(DialogBox_1.DialogBox, { handleClose: () => { this.setState(__assign({}, this.state, { openDialog: false })); }, open: this.state.openDialog, title: this.state.dialogTitle, message: this.state.dialogMessage }),
            React.createElement(SnackbarSimple_1.SnackbarSimple, { open: this.state.openSnackbar, message: this.state.snackbarMessage, handleRequestClose: this.closeSnackbar, hideDuration: 2000 })));
    }
}
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) { return __assign({}, state); }
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapStateToProps)(UtilsBox);
