import * as React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";

const mapStateToProps = (state) => ({ chatroomReducer: state.chatroomReducer });
export const ToolbarEnhancer = compose(
    connect(mapStateToProps),
    withHandlers({
        onMenuSelect: (props: any) => (id, value) => {
            props.listener(props, id, value);
        },
        onBackPressed: (props: any) => () => {
            props.router.goBack();
        }
    })
);