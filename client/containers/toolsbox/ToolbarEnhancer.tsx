import * as React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, ComponentEnhancer } from "recompose";

const mapStateToProps = (state) => ({
    chatroomReducer: state.chatroomReducer,
    teamReducer: state.teamReducer
});

export const ToolbarEnhancer = compose(
    connect(mapStateToProps),
    withHandlers({
        onMenuSelect: (props: any) => (id, value) => {
            props.listener(props, id, value);
        },
        onBackPressed: (props: any) => () => {
            props.history.goBack();
        },
        onPressTitle: (props: any) => (e) => {
            props.history.replace("/chatslist/${props.teamReducer.team._id}");
        }
    })
) as ComponentEnhancer<{ onMenuSelect, onBackPressed, listener: (props, id, value) => void, history }, any>;