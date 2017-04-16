import * as React from "react";
import { withState, compose, pure, withHandlers, lifecycle, shallowEqual } from "recompose";

export const DialogBoxEnhancer = compose(
    withState("title", "setTitle", "Alert!"),
    withState("message", "setMessage", ({ message }) => message),
    withState("open", "setOpen", false),
    withHandlers({
        onError: (props: any) => (error: string) => {
            props.setMessage(message => error);
            props.setOpen(open => true);
        },
        handleClose: (props: any) => () => {
            props.setMessage(message => "");
            props.setOpen(open => false);
        }
    }),
    pure
);