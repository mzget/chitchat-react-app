import * as React from "react";
import { connect } from "react-redux";
import { withState, compose, pure, withHandlers, lifecycle, shallowEqual, ComponentEnhancer } from "recompose";

const mapStateToProps = (state) => ({
    alertReducer: state.alertReducer
});

export const DialogBoxEnhancer = compose(
    connect(mapStateToProps),
    withState("title", "setTitle", "Alert!"),
    withState("message", "setMessage", ({ message }) => message),
    withState("open", "setOpen", false),
    lifecycle({
        componentWillReceiveProps(nextProps) {
            let { alertReducer } = nextProps;

            if (!shallowEqual(alertReducer.error, this.props.alertReducer.error) && alertReducer.error != null) {
                this.props.setMessage(message => alertReducer.error);
                this.props.setOpen(open => true);
            }
        }
    }),
    withHandlers({
        onError: (props: any) => (error: string) => {
            props.setMessage(message => error);
            props.setOpen(open => true);
        },
        handleClose: (props: any) => () => {
            props.setMessage(message => "");
            props.setOpen(open => false);
            props.dispatch({ type: "CLEAR_ALERT" });
        }
    }),
    pure
) as ComponentEnhancer<{ title, message, open, handleClose, onError: (error: string) => void }, any>;