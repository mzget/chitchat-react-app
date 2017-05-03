"use strict";
const react_redux_1 = require("react-redux");
const recompose_1 = require("recompose");
const editGroupRxActions = require("../../redux/group/editGroupRxActions");
exports.EditGroupMemberEnhancer = recompose_1.compose(react_redux_1.connect(), recompose_1.withState("value", "setValue", "0"), recompose_1.withHandlers({
    removeItem: (props) => (item) => {
        props.dispatch(editGroupRxActions.removeGroupMember(props.room_id, item._id));
    }
}));
