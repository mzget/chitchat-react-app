"use strict";
exports.__esModule = true;
var react_redux_1 = require("react-redux");
var recompose_1 = require("recompose");
var mapStateToProps = function (state) { return ({
    chatroomReducer: state.chatroomReducer,
    teamReducer: state.teamReducer
}); };
exports.ToolbarEnhancer = recompose_1.compose(react_redux_1.connect(mapStateToProps), recompose_1.withHandlers({
    onMenuSelect: function (props) { return function (id, value) {
        props.listener(props, id, value);
    }; },
    onBackPressed: function (props) { return function () {
        props.history.goBack();
    }; },
    onPressTitle: function (props) { return function (e) {
        props.history.replace("/chatslist/" + props.teamReducer.team.name);
    }; }
}));
