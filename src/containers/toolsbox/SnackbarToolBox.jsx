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
var SnackbarSimple_1 = require("../../components/SnackbarSimple");
;
var SnackbarBox = (function (_super) {
    __extends(SnackbarBox, _super);
    function SnackbarBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SnackbarBox.prototype.componentWillMount = function () {
        this.state = {
            openSnackbar: false,
            snackbarMessage: "",
            snackbarClose: null
        };
        this.closeSnackbar = this.closeSnackbar.bind(this);
    };
    SnackbarBox.prototype.componentWillReceiveProps = function (nextProps) {
        var stalkReducer = nextProps.stalkReducer;
        if (stalkReducer.notiMessage != this.props.stalkReducer.notiMessage) {
            this.setState(function (previousState) { return (__assign({}, previousState, { openSnackbar: true, snackbarMessage: stalkReducer.notiMessage })); });
        }
    };
    SnackbarBox.prototype.closeSnackbar = function (reason) {
        this.setState(function (previousState) { return (__assign({}, previousState, { openSnackbar: false })); });
    };
    SnackbarBox.prototype.render = function () {
        return (<div>
                <SnackbarSimple_1.SnackbarSimple open={this.state.openSnackbar} message={this.state.snackbarMessage} handleRequestClose={this.closeSnackbar} hideDuration={2000}/>
            </div>);
    };
    return SnackbarBox;
}(React.Component));
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) { return __assign({}, state); }
exports.SnackbarToolBox = react_redux_1.connect(mapStateToProps)(SnackbarBox);
