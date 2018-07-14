/**
 * Copyright 2017 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
import * as Rx from "rxjs/Rx";
const { ajax } = Rx.Observable;
import { BackendFactory } from "stalk-js/starter";
import InternalStore from "stalk-simplechat";
import * as ServiceProvider from "../../services/ServiceProvider";
const getStore = () => InternalStore.store;
const authReducer = () => InternalStore.authStore;
export const STALK_REMOVE_ROOM_ACCESS = "STALK_REMOVE_ROOM_ACCESS";
export const STALK_REMOVE_ROOM_ACCESS_FAILURE = "STALK_REMOVE_ROOM_ACCESS_FAILURE";
export const STALK_REMOVE_ROOM_ACCESS_SUCCESS = "STALK_REMOVE_ROOM_ACCESS_SUCCESS";
export const STALK_REMOVE_ROOM_ACCESS_CANCELLED = "STALK_REMOVE_ROOM_ACCESS_CANCELLED";
export const removeRoomAccess = (room_id) => ({ type: STALK_REMOVE_ROOM_ACCESS, payload: room_id });
const removeRoomAccess_Success = (payload) => ({ type: STALK_REMOVE_ROOM_ACCESS_SUCCESS, payload });
const removeRoomAccess_Cancelled = () => ({ type: STALK_REMOVE_ROOM_ACCESS_CANCELLED });
const removeRoomAccess_Failure = (error) => ({ type: STALK_REMOVE_ROOM_ACCESS_FAILURE, payload: error });
export const removeRoomAccessEpic = (action$) => (action$.ofType(STALK_REMOVE_ROOM_ACCESS)
    .mergeMap((action) => {
    const { _id } = authReducer().user;
    return ServiceProvider.removeLastAccessRoomInfo(_id, action.payload);
}).map((json) => {
    console.log("removeRoomAccess_Epic", json.response);
    const result = json.response;
    if (result.success && result.result.length > 0) {
        return removeRoomAccess_Success(result.result);
    }
    else {
        return removeRoomAccess_Failure(result.message);
    }
})
    .do((x) => {
    if (x.type === STALK_REMOVE_ROOM_ACCESS_SUCCESS) {
        waitForRemovedRoom(x.payload);
    }
})
    .takeUntil(action$.ofType(STALK_REMOVE_ROOM_ACCESS_CANCELLED))
    .catch((error) => Rx.Observable.of(removeRoomAccess_Failure(error.xhr.response))));
const waitForRemovedRoom = async (data) => {
    const id = setInterval(() => {
        const { state } = getStore().getState().chatlogReducer;
        if (state === STALK_REMOVE_ROOM_ACCESS_SUCCESS) {
            BackendFactory.getInstance().dataListener.onAccessRoom(data);
            clearInterval(id);
        }
    }, 100);
};
const UPDATE_LAST_ACCESS_ROOM = "UPDATE_LAST_ACCESS_ROOM";
export const UPDATE_LAST_ACCESS_ROOM_SUCCESS = "UPDATE_LAST_ACCESS_ROOM_SUCCESS";
export const UPDATE_LAST_ACCESS_ROOM_FAILURE = "UPDATE_LAST_ACCESS_ROOM_FAILURE";
const UPDATE_LAST_ACCESS_ROOM_CANCELLED = "UPDATE_LAST_ACCESS_ROOM_CANCELLED";
export const updateLastAccessRoom = (roomId) => ({ type: UPDATE_LAST_ACCESS_ROOM, payload: roomId });
const updateLastAccessRoomSuccess = (payload) => ({ type: UPDATE_LAST_ACCESS_ROOM_SUCCESS, payload });
const updateLastAccessRoomFailure = (error) => ({ type: UPDATE_LAST_ACCESS_ROOM_FAILURE, payload: error });
export const updateLastAccessRoomCancelled = () => ({ type: UPDATE_LAST_ACCESS_ROOM_CANCELLED });
export const updateLastAccessRoomEpic = (action$) => action$.ofType(UPDATE_LAST_ACCESS_ROOM).mergeMap((action) => {
    const { _id } = authReducer().user;
    return ServiceProvider.updateLastAccessRoomInfo(_id, action.payload);
})
    .map((response) => {
    console.log("updateLastAccessRoom value", response.xhr.response);
    const results = response.xhr.response.result[0];
    const tempRoomAccess = results.roomAccess;
    const roomAccess = getStore().getState().chatlogReducer.get("roomAccess");
    let newRoomAccess = new Array();
    if (Array.isArray(roomAccess)) {
        const has = roomAccess.some((value) => (value.roomId === tempRoomAccess[0].roomId));
        if (!has) {
            roomAccess.push(tempRoomAccess[0]);
            newRoomAccess = roomAccess.slice();
        }
        else {
            newRoomAccess = roomAccess.map((value, id) => {
                if (value.roomId === tempRoomAccess[0].roomId) {
                    value.accessTime = tempRoomAccess[0].accessTime;
                }
                return value;
            });
        }
    }
    else {
        newRoomAccess = tempRoomAccess.slice();
    }
    BackendFactory.getInstance().dataListener.onUpdatedLastAccessTime(tempRoomAccess[0]);
    return updateLastAccessRoomSuccess(newRoomAccess);
})
    .do((x) => {
    if (x.payload) {
        // BackendFactory.getInstance().dataManager.setRoomAccessForUser(x.payload);
    }
})
    .takeUntil(action$.ofType(UPDATE_LAST_ACCESS_ROOM_CANCELLED))
    .catch((error) => Rx.Observable.of(updateLastAccessRoomFailure(error.message)));
export const GET_LAST_ACCESS_ROOM = "GET_LAST_ACCESS_ROOM";
export const GET_LAST_ACCESS_ROOM_SUCCESS = "GET_LAST_ACCESS_ROOM_SUCCESS";
export const GET_LAST_ACCESS_ROOM_FAILURE = "GET_LAST_ACCESS_ROOM_FAILURE";
export const getLastAccessRoom = (teamId) => ({ type: GET_LAST_ACCESS_ROOM, payload: { teamId } });
const getLastAccessRoomSuccess = (payload) => ({ type: GET_LAST_ACCESS_ROOM_SUCCESS, payload });
const getLastAccessRoomFailure = (error) => ({ type: GET_LAST_ACCESS_ROOM_FAILURE, payload: error });
export const getLastAccessRoomEpic = (action$) => (action$.ofType(GET_LAST_ACCESS_ROOM).mergeMap((action) => {
    const { teamId } = action.payload;
    return ServiceProvider.getLastAccessRoomInfo(teamId)
        .then((response) => response.json())
        .then((json) => {
        console.log("getLastAccessRoomInfo result", json);
        return json;
    });
}).map((json) => {
    const result = json.result;
    BackendFactory.getInstance().dataListener.onAccessRoom(result);
    return getLastAccessRoomSuccess(result);
})
    .catch((json) => Rx.Observable.of(getLastAccessRoomFailure(json))));
