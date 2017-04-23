"use strict";
const react_redux_1 = require("react-redux");
const recompose_1 = require("recompose");
const mapStateToProps = (state) => ({ chatroomReducer: state.chatroomReducer });
exports.ToolbarEnhancer = recompose_1.compose(react_redux_1.connect(mapStateToProps), recompose_1.withHandlers({
    onMenuSelect: (props) => (id, value) => {
        props.listener(props, id, value);
    },
    onBackPressed: (props) => () => {
        props.history.goBack();
    }
}));
