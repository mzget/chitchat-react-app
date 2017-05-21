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
import { SnackbarSimple } from "../../components/SnackbarSimple";
;
class SnackbarBox extends React.Component {
    componentWillMount() {
        this.state = {
            openSnackbar: false,
            snackbarMessage: "",
            snackbarClose: null
        };
        this.closeSnackbar = this.closeSnackbar.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let { stalkReducer } = nextProps;
        if (stalkReducer.notiMessage != this.props.stalkReducer.notiMessage) {
            this.setState(previousState => (__assign({}, previousState, { openSnackbar: true, snackbarMessage: stalkReducer.notiMessage })));
        }
    }
    closeSnackbar(reason) {
        this.setState(previousState => (__assign({}, previousState, { openSnackbar: false })));
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(SnackbarSimple, { open: this.state.openSnackbar, message: this.state.snackbarMessage, handleRequestClose: this.closeSnackbar, hideDuration: 2000 })));
    }
}
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) { return __assign({}, state); }
export const SnackbarToolBox = connect(mapStateToProps)(SnackbarBox);
