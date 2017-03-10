/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * Redux actions creator.
 */
"use strict";
const BackendFactory_1 = require("../../chats/BackendFactory");
const httpStatusCode_1 = require("../../libs/stalk/utils/httpStatusCode");
class MessageActionsType {
}
MessageActionsType.STOP = "STOP";
MessageActionsType.GET_ROOMID_REQUEST = "GET_ROOMID_REQUEST";
MessageActionsType.GET_ROOMID_SUCCESS = "GET_ROOMID_SUCCESS";
MessageActionsType.GET_ROOMID_FAILURE = "GET_ROOMID_FAILURE";
MessageActionsType.LEAVE_ROOM_REQUEST = "LEAVE_ROOM_REQUEST";
MessageActionsType.LEAVE_ROOM_SUCCESS = "LEAVE_ROOM_SUCCESS";
MessageActionsType.LEAVE_ROOM_FAILURE = "LEAVE_ROOM_FAILURE";
exports.MessageActionsType = MessageActionsType;
function stop() {
    return { type: MessageActionsType.STOP };
}
exports.stop = stop;
function getRoomId_request() {
    return { type: MessageActionsType.GET_ROOMID_REQUEST };
}
function getRoomId_success(data) {
    return { type: MessageActionsType.GET_ROOMID_SUCCESS, payload: data };
}
function getRoomId_failure() {
    return { type: MessageActionsType.GET_ROOMID_FAILURE };
}
function getDirectMessageRoomId(token, myId, contactId) {
    return dispatch => {
        dispatch(getRoomId_request());
        BackendFactory_1.BackendFactory.getInstance().getServer().getPrivateChatRoomId(token, myId, contactId, (err, res) => {
            if (err) {
                dispatch(getRoomId_failure());
            }
            else {
                if (res.code == httpStatusCode_1.default.success) {
                    let roomInfo = res.data;
                    dispatch(getRoomId_success(roomInfo));
                }
                else {
                    console.warn(res);
                    dispatch(getRoomId_failure());
                }
            }
        });
    };
}
exports.getDirectMessageRoomId = getDirectMessageRoomId;
function leaveRoom_request() {
    return { type: MessageActionsType.LEAVE_ROOM_REQUEST };
}
function leaveRoom_success(data) {
    return { type: MessageActionsType.LEAVE_ROOM_SUCCESS, payload: data };
}
function leaveRoom_failure() {
    return { type: MessageActionsType.LEAVE_ROOM_FAILURE };
}
function leaveRoom(token, currentRid, username) {
    return dispatch => {
        dispatch(leaveRoom_request());
        BackendFactory_1.BackendFactory.getInstance().getServer().LeaveChatRoomRequest(token, currentRid, username, (err, res) => {
            if (err) {
                dispatch(leaveRoom_failure());
            }
            else {
                if (res.code === httpStatusCode_1.default.success) {
                    dispatch(leaveRoom_success());
                }
                else {
                    dispatch(leaveRoom_failure());
                }
            }
        });
    };
}
exports.leaveRoom = leaveRoom;
