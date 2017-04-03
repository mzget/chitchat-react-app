"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recompose_1 = require("recompose");
const DialogBox_1 = require("../../components/DialogBox");
const enhance = recompose_1.compose(recompose_1.withPropsOnChange(["open", "title", "message", "handleClose"], ({ open, title, message, handleClose }) => {
    return {
        open, title, message, handleClose
    };
}));
exports.ChatRoomDialogBoxEnhancer = enhance(DialogBox_1.DialogBox);
