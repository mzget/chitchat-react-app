import * as React from "react";
import { compose, withPropsOnChange, withHandlers } from "recompose";

import { DialogBox, IDialoxBoxProps } from "../../components/DialogBox";

const enhance = compose(
    withPropsOnChange(["open", "title", "message", "handleClose"], ({
         open, title, message, handleClose
         }) => {
        return {
            open, title, message, handleClose
        };
    })
);

export const ChatRoomDialogBoxEnhancer = enhance(DialogBox) as React.ComponentClass<IDialoxBoxProps>;
