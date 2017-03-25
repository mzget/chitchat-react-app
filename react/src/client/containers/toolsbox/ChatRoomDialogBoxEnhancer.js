"use strict";
const react_redux_1 = require("react-redux");
const recompose_1 = require("recompose");
const DialogBox_1 = require("../../components/DialogBox");
exports.ChatRoomDialogBoxEnhancer = recompose_1.compose(react_redux_1.connect((state, props) => {
    return {
        chatroomReducer: state.chatroomReducer
    };
}), recompose_1.withHandlers({
    handleClose: props => event => {
        console.log("handleClose", props);
    }
}), recompose_1.withPropsOnChange(["openDialog", "dialogTitle", "dialogMessage", "handleClose"], ({ openDialog, dialogTitle, dialogMessage, handleClose }) => {
    return {
        open: openDialog,
        title: dialogTitle,
        message: dialogMessage,
        handleClose
    };
}))(DialogBox_1.DialogBox);
