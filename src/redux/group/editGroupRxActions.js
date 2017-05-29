"use strict";
var redux_actions_1 = require("redux-actions");
var Rx = require("rxjs/Rx");
var ajax = Rx.Observable.ajax;
var Room_1 = require("../../chitchat/shared/Room");
var groupService = require("../../chitchat/chats/services/groupService");
var chitchatFactory_1 = require("../../chitchat/chats/chitchatFactory");
var config = function () { return chitchatFactory_1.ChitChatFactory.getInstance().config; };
var configureStore_1 = require("../configureStore");
var privateGroupRxActions_1 = require("./privateGroupRxActions");
var chatroomActions = require("../../chitchat/chats/redux/chatroom/chatroomActions");
/**
 * Edit group members...
 */
var EDIT_GROUP_MEMBER = "EDIT_GROUP_MEMBER";
exports.EDIT_GROUP_MEMBER_SUCCESS = "EDIT_GROUP_MEMBER_SUCCESS";
var EDIT_GROUP_MEMBER_FAILURE = "EDIT_GROUP_MEMBER_FAILURE";
var EDIT_GROUP_MEMBER_CANCELLED = "EDIT_GROUP_MEMBER_CANCELLED";
exports.editGroupMember = redux_actions_1.createAction(EDIT_GROUP_MEMBER, function (payload) { return payload; });
var editGroupMemberSuccess = redux_actions_1.createAction(exports.EDIT_GROUP_MEMBER_SUCCESS, function (payload) { return payload; });
var editGroupMemberFailure = redux_actions_1.createAction(EDIT_GROUP_MEMBER_FAILURE, function (err) { return err; });
var editGroupMemberCancelled = redux_actions_1.createAction(EDIT_GROUP_MEMBER_CANCELLED);
exports.editGroupMember_Epic = function (action$) { return (action$.ofType(EDIT_GROUP_MEMBER).mergeMap(function (action) {
    return ajax({
        method: "POST",
        url: config().api.group + "/editMember/" + action.payload.room_id,
        body: JSON.stringify({ members: action.payload.members }),
        headers: {
            "Content-Type": "application/json",
            "x-access-token": configureStore_1["default"].getState().authReducer.token
        }
    }).map(function (response) { return editGroupMemberSuccess(response.xhr.response); })
        .takeUntil(action$.ofType(EDIT_GROUP_MEMBER_CANCELLED))["catch"](function (error) { return Rx.Observable.of(editGroupMemberFailure(error.xhr.response)); })["do"](function (response) {
        // if (response.type == GET_ORG_GROUP_SUCCESS) {
        //     const dataManager = BackendFactory.getInstance().dataManager;
        //     let rooms = response.payload.result as Array<Room>;
        //     Rx.Observable.from(rooms)._do(x => {
        //         dataManager.roomDAL.save(x._id, x);
        //     }).subscribe();
        // }
    });
})); };
/**
 * Add group member...
 *  */
var ADD_GROUP_MEMBER = "ADD_GROUP_MEMBER";
exports.ADD_GROUP_MEMBER_SUCCESS = "ADD_GROUP_MEMBER_SUCCESS";
var ADD_GROUP_MEMBER_FAILURE = "ADD_GROUP_MEMBER_FAILURE";
var ADD_GROUP_MEMBER_CANCELLED = "ADD_GROUP_MEMBER_CANCELLED";
exports.addGroupMember = redux_actions_1.createAction(ADD_GROUP_MEMBER, function (room_id, member) { return ({ room_id: room_id, member: member }); });
var addGroupMemberSuccess = redux_actions_1.createAction(exports.ADD_GROUP_MEMBER_SUCCESS, function (payload) { return payload.result; });
var addGroupMemberFailure = redux_actions_1.createAction(ADD_GROUP_MEMBER_FAILURE, function (error) { return error; });
var addGroupMemberCancelled = redux_actions_1.createAction(ADD_GROUP_MEMBER_CANCELLED);
exports.addGroupMember_Epic = function (action$) {
    return action$.ofType(ADD_GROUP_MEMBER)
        .mergeMap(function (action) { return groupService.addMember(action.payload.room_id, action.payload.member)
        .map(function (response) { return addGroupMemberSuccess(response.xhr.response); })
        .takeUntil(action$.ofType(ADD_GROUP_MEMBER_CANCELLED))["catch"](function (error) { return Rx.Observable.of(addGroupMemberFailure(error.xhr.response)); })
        ._do(function (response) {
        if (response.type == exports.ADD_GROUP_MEMBER_SUCCESS) {
            var group_1 = response.payload;
            if (group_1.type == Room_1.RoomType.privateGroup) {
                var privateGroups = configureStore_1["default"].getState().groupReducer.privateGroups;
                var newPrivateGroups = privateGroups.map(function (v) {
                    if (v._id == group_1._id) {
                        v = group_1;
                    }
                    return v;
                });
                configureStore_1["default"].dispatch({ type: privateGroupRxActions_1.SET_PRIVATE_GROUP, payload: newPrivateGroups });
                configureStore_1["default"].dispatch(chatroomActions.updateChatRoom(newPrivateGroups));
            }
        }
    }); });
};
/**
 * Remove group members...
 */
var REMOVE_GROUP_MEMBER = "REMOVE_GROUP_MEMBER";
exports.REMOVE_GROUP_MEMBER_SUCCESS = "REMOVE_GROUP_MEMBER_SUCCESS";
exports.REMOVE_GROUP_MEMBER_FAILURE = "REMOVE_GROUP_MEMBER_FAILURE";
var REMOVE_GROUP_MEMBER_CANCELLED = "REMOVE_GROUP_MEMBER_CANCELLED";
exports.removeGroupMember = redux_actions_1.createAction(REMOVE_GROUP_MEMBER, function (room_id, member_id) { return ({ room_id: room_id, member_id: member_id }); });
var removeGroupMemberSuccess = redux_actions_1.createAction(exports.REMOVE_GROUP_MEMBER_SUCCESS, function (payload) { return payload.result; });
var removeGroupMemberFailure = redux_actions_1.createAction(exports.REMOVE_GROUP_MEMBER_FAILURE, function (error) { return error; });
var removeGroupMemberCancelled = redux_actions_1.createAction(REMOVE_GROUP_MEMBER_CANCELLED);
exports.removeGroupMember_Epic = function (action$) {
    return action$.ofType(REMOVE_GROUP_MEMBER)
        .mergeMap(function (action) {
        return groupService.removeMember(action.payload.room_id, action.payload.member_id)
            .map(function (response) { return removeGroupMemberSuccess(response.xhr.response); })
            .takeUntil(action$.ofType(REMOVE_GROUP_MEMBER_CANCELLED))["catch"](function (error) { return Rx.Observable.of(removeGroupMemberFailure(error.xhr.response)); })
            ._do(function (response) {
            if (response.type == exports.REMOVE_GROUP_MEMBER_SUCCESS) {
                var group_2 = response.payload;
                if (group_2.type == Room_1.RoomType.privateGroup) {
                    var privateGroups = configureStore_1["default"].getState().groupReducer.privateGroups;
                    var newPrivateGroups = privateGroups.map(function (v) {
                        if (v._id == group_2._id) {
                            v = group_2;
                        }
                        return v;
                    });
                    configureStore_1["default"].dispatch({ type: privateGroupRxActions_1.SET_PRIVATE_GROUP, payload: newPrivateGroups });
                    configureStore_1["default"].dispatch(chatroomActions.updateChatRoom(newPrivateGroups));
                }
            }
        });
    });
};
/**
 * Group details...
 */
var EDIT_GROUP_DETAIL = "EDIT_GROUP_DETAIL";
exports.EDIT_GROUP_DETAIL_SUCCESS = "EDIT_GROUP_DETAIL_SUCCESS";
exports.EDIT_GROUP_DETAIL_FAILURE = "EDIT_GROUP_DETAIL_FAILURE";
var EDIT_GROUP_DETAIL_CANCELLED = "EDIT_GROUP_DETAIL_CANCELLED";
exports.editGroupDetail = redux_actions_1.createAction(EDIT_GROUP_DETAIL, function (room) { return room; });
var editGroupDetailSuccess = redux_actions_1.createAction(exports.EDIT_GROUP_DETAIL_SUCCESS, function (payload) { return payload; });
var editGroupDetailFailure = redux_actions_1.createAction(exports.EDIT_GROUP_DETAIL_FAILURE, function (error) { return error; });
var editGroupDetailCancelled = redux_actions_1.createAction(EDIT_GROUP_DETAIL_CANCELLED);
exports.editGroupDetail_Epic = function (action$) { return (action$.ofType(EDIT_GROUP_DETAIL).mergeMap(function (action) {
    return ajax({
        method: "POST",
        url: config().api.group + "/update",
        body: JSON.stringify({ room: action.payload }),
        headers: {
            "Content-Type": "application/json",
            "x-access-token": configureStore_1["default"].getState().authReducer.token
        }
    }).map(function (response) { return editGroupDetailSuccess(response.xhr.response); })
        .takeUntil(action$.ofType(EDIT_GROUP_DETAIL_CANCELLED))["catch"](function (error) { return Rx.Observable.of(editGroupDetailFailure(error.xhr.response)); });
})); };
