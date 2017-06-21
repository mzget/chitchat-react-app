"use strict";
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * Redux actions creator.
 */
exports.__esModule = true;
var BackendFactory_1 = require("../../chitchat/chats/BackendFactory");
var stalk_js_1 = require("stalk-js");
var MessageActionsType = (function () {
    function MessageActionsType() {
    }
    return MessageActionsType;
}());
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
    return function (dispatch) {
        dispatch(getRoomId_request());
        var server = BackendFactory_1.BackendFactory.getInstance().getServer();
        server.getPrivateChatRoomId(token, myId, contactId, function (err, res) {
            if (err) {
                dispatch(getRoomId_failure());
            }
            else {
                if (res.code == stalk_js_1.Utils.statusCode.success) {
                    var roomInfo = res.data;
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
    return function (dispatch) {
        dispatch(leaveRoom_request());
        var server = BackendFactory_1.BackendFactory.getInstance().getServer();
        server.getLobby().leaveRoom(token, currentRid, function (err, res) {
            if (err) {
                dispatch(leaveRoom_failure());
            }
            else {
                if (res.code === stalk_js_1.Utils.statusCode.success) {
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
