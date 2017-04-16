"use strict";
const recompose_1 = require("recompose");
exports.DialogBoxEnhancer = recompose_1.compose(recompose_1.withState("title", "setTitle", "Alert!"), recompose_1.withState("message", "setMessage", ({ message }) => message), recompose_1.withState("open", "setOpen", false), recompose_1.withHandlers({
    onError: (props) => (error) => {
        props.setMessage(message => error);
        props.setOpen(open => true);
    },
    handleClose: (props) => () => {
        props.setMessage(message => "");
        props.setOpen(open => false);
    }
}), recompose_1.pure);
