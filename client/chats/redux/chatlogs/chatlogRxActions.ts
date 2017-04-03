/**
 * Copyright 2017 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */

import { createAction, Reducer } from "redux-actions";
import * as Rx from "@reactivex/rxjs";
const { ajax } = Rx.Observable;

import { BackendFactory } from "../../BackendFactory";
import ChatRoomComponent from "../../chatRoomComponent";
import * as ServiceProvider from "../../services/ServiceProvider";

import {
    STALK_INIT_CHATSLOG
} from "./chatlogsActions";

import Store from "../../../redux/configureStore";
import config from "../../../configs/config";

export const STALK_REMOVE_ROOM_ACCESS = "STALK_REMOVE_ROOM_ACCESS";
export const STALK_REMOVE_ROOM_ACCESS_FAILURE = "STALK_REMOVE_ROOM_ACCESS_FAILURE";
export const STALK_REMOVE_ROOM_ACCESS_SUCCESS = "STALK_REMOVE_ROOM_ACCESS_SUCCESS";
export const STALK_REMOVE_ROOM_ACCESS_CANCELLED = "STALK_REMOVE_ROOM_ACCESS_CANCELLED";

export const removeRoomAccess = (room_id: string) => ({ type: STALK_REMOVE_ROOM_ACCESS, payload: room_id });
const removeRoomAccess_Success = (payload) => ({ type: STALK_REMOVE_ROOM_ACCESS_SUCCESS, payload });
const removeRoomAccess_Cancelled = () => ({ type: STALK_REMOVE_ROOM_ACCESS_CANCELLED });
const removeRoomAccess_Failure = error => ({ type: STALK_REMOVE_ROOM_ACCESS_FAILURE, payload: error });
export const removeRoomAccess_Epic = action$ => (
    action$.ofType(STALK_REMOVE_ROOM_ACCESS)
        .mergeMap(action => {
            let { _id } = Store.getState().userReducer.user;
            return ServiceProvider.removeLastAccessRoomInfo(_id, action.payload);
        }).map(json => {
            let result = json.response;
            if (result.success && result.result.length > 0) {
                return removeRoomAccess_Success(result.result);
            }
            else {
                return removeRoomAccess_Failure(result.message);
            }
        })
        .do(x => {
            if (x.type == STALK_REMOVE_ROOM_ACCESS_SUCCESS) {
                waitForRemovedRoom(x.payload);
            }
        })
        .takeUntil(action$.ofType(STALK_REMOVE_ROOM_ACCESS_CANCELLED))
        .catch(error => Rx.Observable.of(removeRoomAccess_Failure(error.xhr.response)))
);

const waitForRemovedRoom = async (data) => {
    let id = setInterval(() => {
        let { state } = Store.getState().chatlogReducer;
        if (state == STALK_REMOVE_ROOM_ACCESS_SUCCESS) {
            BackendFactory.getInstance().dataListener.onAccessRoom(data);

            clearInterval(id);
        }
    }, 100);
};


const UPDATE_LAST_ACCESS_ROOM = "UPDATE_LAST_ACCESS_ROOM";
export const UPDATE_LAST_ACCESS_ROOM_SUCCESS = "UPDATE_LAST_ACCESS_ROOM_SUCCESS";
export const UPDATE_LAST_ACCESS_ROOM_FAILURE = "UPDATE_LAST_ACCESS_ROOM_FAILURE";
const UPDATE_LAST_ACCESS_ROOM_CANCELLED = "UPDATE_LAST_ACCESS_ROOM_CANCELLED";
export const updateLastAccessRoom = createAction(UPDATE_LAST_ACCESS_ROOM, room_id => room_id);
const updateLastAccessRoomSuccess = createAction(UPDATE_LAST_ACCESS_ROOM_SUCCESS, payload => payload);
const updateLastAccessRoomFailure = createAction(UPDATE_LAST_ACCESS_ROOM_FAILURE, error => error);
export const updateLastAccessRoomCancelled = createAction(UPDATE_LAST_ACCESS_ROOM_CANCELLED);
export const updateLastAccessRoom_Epic = action$ =>
    action$.ofType(UPDATE_LAST_ACCESS_ROOM)
        .mergeMap(action => {
            let { _id } = Store.getState().userReducer.user;
            return ServiceProvider.updateLastAccessRoomInfo(_id, action.payload);
        })
        .map(response => {
            console.log("updateLastAccessRoom_Epic", response.xhr.response);

            let result = response.xhr.response.result[0];
            let _tempRoomAccess = result.roomAccess as Array<any>;
            let roomAccess = Store.getState().chatlogReducer.get("roomAccess") as Array<any>;

            let _newRoomAccess = new Array();
            if (Array.isArray(roomAccess)) {
                let _has = roomAccess.some(value => (value.roomId == _tempRoomAccess[0].roomId));
                if (!_has) {
                    roomAccess.push(_tempRoomAccess[0]);
                    _newRoomAccess = roomAccess.slice();
                }
                else {
                    _newRoomAccess = roomAccess.map((value, id) => {
                        if (value.roomId == _tempRoomAccess[0].roomId) {
                            value.accessTime = _tempRoomAccess[0].accessTime;
                        }
                        return value;
                    });
                }
            }

            BackendFactory.getInstance().dataListener.onUpdatedLastAccessTime(_tempRoomAccess[0]);

            return updateLastAccessRoomSuccess(_newRoomAccess);
        })
        .do(x => {
            if (x.payload) {
                BackendFactory.getInstance().dataManager.setRoomAccessForUser(x.payload);
            }
        })
        .takeUntil(action$.ofType(UPDATE_LAST_ACCESS_ROOM_CANCELLED))
        .catch(error => {
            console.warn("updateLastAccessRoomInfo fail", error);

            Rx.Observable.of(updateLastAccessRoomFailure(error.xhr.response));
        });


export const GET_LAST_ACCESS_ROOM = "GET_LAST_ACCESS_ROOM";
export const GET_LAST_ACCESS_ROOM_SUCCESS = "GET_LAST_ACCESS_ROOM_SUCCESS";
export const GET_LAST_ACCESS_ROOM_FAILURE = "GET_LAST_ACCESS_ROOM_FAILURE";
const getLastAccessRoomRequest = () => ({ type: GET_LAST_ACCESS_ROOM });
const getLastAccessRoomSuccess = (payload) => ({ type: GET_LAST_ACCESS_ROOM_SUCCESS, payload });
const getLastAccessRoomFailure = (error) => ({ type: GET_LAST_ACCESS_ROOM_FAILURE, payload: error });
export const getLastAccessRoom_Epic = action$ =>
    action$.ofType(STALK_INIT_CHATSLOG)
        .mergeMap(action => {
            let { _id } = Store.getState().userReducer.user;
            return ServiceProvider.getLastAccessRoomInfo(_id)
                .then(response => response.json())
                .then(json => json);
        })
        .map(json => {
            BackendFactory.getInstance().dataListener.onAccessRoom(json.result);
            return getLastAccessRoomSuccess(json.result);
        })
        .catch(json => Rx.Observable.of(getLastAccessRoomFailure(json.message)));