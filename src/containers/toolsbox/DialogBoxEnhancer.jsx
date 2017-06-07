"use strict";
var react_redux_1 = require("react-redux");
var recompose_1 = require("recompose");
var mapStateToProps = function (state) { return ({
    alertReducer: state.alertReducer
}); };
exports.DialogBoxEnhancer = recompose_1.compose(react_redux_1.connect(mapStateToProps), recompose_1.withState("title", "setTitle", "Alert!"), recompose_1.withState("message", "setMessage", function (_a) {
    var message = _a.message;
    return message;
}), recompose_1.withState("open", "setOpen", false), recompose_1.lifecycle({
    componentWillReceiveProps: function (nextProps) {
        var alertReducer = nextProps.alertReducer;
        if (!recompose_1.shallowEqual(alertReducer.error, this.props.alertReducer.error) && alertReducer.error != null) {
            this.props.setMessage(function (message) { return alertReducer.error; });
            this.props.setOpen(function (open) { return true; });
        }
    }
}), recompose_1.withHandlers({
    onError: function (props) { return function (error) {
        props.setMessage(function (message) { return error; });
        props.setOpen(function (open) { return true; });
    }; },
    handleClose: function (props) { return function () {
        props.setMessage(function (message) { return ""; });
        props.setOpen(function (open) { return false; });
        props.dispatch({ type: "CLEAR_ALERT" });
    }; }
}), recompose_1.pure);
