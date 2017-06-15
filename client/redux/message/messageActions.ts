/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * Redux actions creator.
 */

import { BackendFactory } from "../../chitchat/chats/BackendFactory";
import { Utils } from "stalk-js";

export class MessageActionsType {
    static STOP = "STOP";

    static GET_ROOMID_REQUEST = "GET_ROOMID_REQUEST";
    static GET_ROOMID_SUCCESS = "GET_ROOMID_SUCCESS";
    static GET_ROOMID_FAILURE = "GET_ROOMID_FAILURE";

    static LEAVE_ROOM_REQUEST = "LEAVE_ROOM_REQUEST";
    static LEAVE_ROOM_SUCCESS = "LEAVE_ROOM_SUCCESS";
    static LEAVE_ROOM_FAILURE = "LEAVE_ROOM_FAILURE";
}

export function stop() {
    return { type: MessageActionsType.STOP }
}

function getRoomId_request() {
    return { type: MessageActionsType.GET_ROOMID_REQUEST }
}
function getRoomId_success(data?: any) {
    return { type: MessageActionsType.GET_ROOMID_SUCCESS, payload: data }
}
function getRoomId_failure() {
    return { type: MessageActionsType.GET_ROOMID_FAILURE }
}
export function getDirectMessageRoomId(token: string, myId: string, contactId: string) {
    return dispatch => {
        dispatch(getRoomId_request());

        let server = BackendFactory.getInstance().getServer();
        server.getPrivateChatRoomId(token, myId, contactId, (err, res) => {
            if (err) {
                dispatch(getRoomId_failure());
            }
            else {
                if (res.code == Utils.statusCode.success) {
                    let roomInfo = res.data;
                    dispatch(getRoomId_success(roomInfo));
                }
                else {
                    console.warn(res);

                    dispatch(getRoomId_failure());
                }
            }
        });
    }
}


function leaveRoom_request() {
    return { type: MessageActionsType.LEAVE_ROOM_REQUEST }
}
function leaveRoom_success(data?: any) {
    return { type: MessageActionsType.LEAVE_ROOM_SUCCESS, payload: data }
}
function leaveRoom_failure() {
    return { type: MessageActionsType.LEAVE_ROOM_FAILURE }
}
export function leaveRoom(token: string, currentRid: string, username: string) {
    return dispatch => {
        dispatch(leaveRoom_request());

        let server = BackendFactory.getInstance().getServer();
        server.getLobby().leaveRoom(token, currentRid, (err, res) => {
            if (err) {
                dispatch(leaveRoom_failure());
            }
            else {
                if (res.code === Utils.statusCode.success) {
                    dispatch(leaveRoom_success());
                }
                else {
                    dispatch(leaveRoom_failure());
                }
            }
        });
    }
}