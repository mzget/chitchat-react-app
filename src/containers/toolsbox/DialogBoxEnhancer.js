"use strict";
const react_redux_1 = require("react-redux");
const recompose_1 = require("recompose");
const mapStateToProps = (state) => ({
    alertReducer: state.alertReducer
});
exports.DialogBoxEnhancer = recompose_1.compose(react_redux_1.connect(mapStateToProps), recompose_1.withState("title", "setTitle", "Alert!"), recompose_1.withState("message", "setMessage", ({ message }) => message), recompose_1.withState("open", "setOpen", false), recompose_1.withHandlers({
    onError: (props) => (error) => {
        props.setMessage(message => error);
        props.setOpen(open => true);
    },
    handleClose: (props) => () => {
        props.setMessage(message => "");
        props.setOpen(open => false);
        props.dispatch({ type: "CLEAR_ALERT" });
    }
}), recompose_1.pure);
