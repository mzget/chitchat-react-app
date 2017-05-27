/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * Redux actions creator.
 */
import { BackendFactory } from "../../chitchat/chats/BackendFactory";
import HttpStatus from "../../chitchat/libs/stalk/utils/httpStatusCode";
export class MessageActionsType {
}
MessageActionsType.STOP = "STOP";
MessageActionsType.GET_ROOMID_REQUEST = "GET_ROOMID_REQUEST";
MessageActionsType.GET_ROOMID_SUCCESS = "GET_ROOMID_SUCCESS";
MessageActionsType.GET_ROOMID_FAILURE = "GET_ROOMID_FAILURE";
MessageActionsType.LEAVE_ROOM_REQUEST = "LEAVE_ROOM_REQUEST";
MessageActionsType.LEAVE_ROOM_SUCCESS = "LEAVE_ROOM_SUCCESS";
MessageActionsType.LEAVE_ROOM_FAILURE = "LEAVE_ROOM_FAILURE";
export function stop() {
    return { type: MessageActionsType.STOP };
}
function getRoomId_request() {
    return { type: MessageActionsType.GET_ROOMID_REQUEST };
}
function getRoomId_success(data) {
    return { type: MessageActionsType.GET_ROOMID_SUCCESS, payload: data };
}
function getRoomId_failure() {
    return { type: MessageActionsType.GET_ROOMID_FAILURE };
}
export function getDirectMessageRoomId(token, myId, contactId) {
    return dispatch => {
        dispatch(getRoomId_request());
        BackendFactory.getInstance().getServer().getPrivateChatRoomId(token, myId, contactId, (err, res) => {
            if (err) {
                dispatch(getRoomId_failure());
            }
            else {
                if (res.code == HttpStatus.success) {
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
function leaveRoom_request() {
    return { type: MessageActionsType.LEAVE_ROOM_REQUEST };
}
function leaveRoom_success(data) {
    return { type: MessageActionsType.LEAVE_ROOM_SUCCESS, payload: data };
}
function leaveRoom_failure() {
    return { type: MessageActionsType.LEAVE_ROOM_FAILURE };
}
export function leaveRoom(token, currentRid, username) {
    return dispatch => {
        dispatch(leaveRoom_request());
        BackendFactory.getInstance().getServer().LeaveChatRoomRequest(token, currentRid, username, (err, res) => {
            if (err) {
                dispatch(leaveRoom_failure());
            }
            else {
                if (res.code === HttpStatus.success) {
                    dispatch(leaveRoom_success());
                }
                else {
                    dispatch(leaveRoom_failure());
                }
            }
        });
    };
}
