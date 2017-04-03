"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const SnackbarSimple_1 = require("../../components/SnackbarSimple");
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
            this.setState(previousState => (Object.assign({}, previousState, { openSnackbar: true, snackbarMessage: stalkReducer.notiMessage })));
        }
    }
    closeSnackbar(reason) {
        this.setState(previousState => (Object.assign({}, previousState, { openSnackbar: false })));
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(SnackbarSimple_1.SnackbarSimple, { open: this.state.openSnackbar, message: this.state.snackbarMessage, handleRequestClose: this.closeSnackbar, hideDuration: 2000 })));
    }
}
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) { return Object.assign({}, state); }
exports.SnackbarToolBox = react_redux_1.connect(mapStateToProps)(SnackbarBox);
