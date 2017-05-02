"use strict";
const react_redux_1 = require("react-redux");
const recompose_1 = require("recompose");
const editGroupRxActions = require("../../redux/group/editGroupRxActions");
exports.EditGroupMemberEnhancer = recompose_1.compose(react_redux_1.connect(), recompose_1.withState("value", "setValue", "0"), recompose_1.lifecycle({
    componentWillReceiveProps(nextProps) {
        // let { params } = nextProps.match;
        // if (nextProps.match != this.props.match) {
        //     let room = chatroomActions.getRoom(params.room_id);
        //     this.props.updateMembers(members => room.members);
        // }
    }
}), recompose_1.withHandlers({
    removeItem: (props) => (item) => {
        console.log("removeItem", item);
    },
    onSubmit: (props) => event => {
        let payload = { room_id: props.room_id, members: props.members };
        props.dispatch(editGroupRxActions.editGroupMember(payload));
        props.onFinished();
    }
}));
