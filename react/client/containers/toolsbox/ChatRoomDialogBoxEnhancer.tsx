import * as React from "react";
import { connect } from "react-redux";
import { compose, withPropsOnChange, withHandlers } from "recompose";

import { DialogBox } from "../../components/DialogBox";

export const ChatRoomDialogBoxEnhancer = compose(
    connect((state, props) => {
        return {
            chatroomReducer: state.chatroomReducer
        };
    }),
    withHandlers({
        handleClose: props => event => {
            console.log("handleClose", props);
        }
    }),
    withPropsOnChange(["openDialog", "dialogTitle", "dialogMessage", "handleClose"], ({
         openDialog, dialogTitle, dialogMessage, handleClose
         }) => {
        return {
            open: openDialog,
            title: dialogTitle,
            message: dialogMessage,
            handleClose
        };
    })
)(DialogBox);
