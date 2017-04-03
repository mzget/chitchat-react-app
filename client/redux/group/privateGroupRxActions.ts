import * as Rx from "@reactivex/rxjs";
const { Observable: { ajax }, AjaxResponse } = Rx;

import config from "../../configs/config";
import Store from "../configureStore";
import { BackendFactory } from "../../chats/BackendFactory";
import { Room, RoomType } from "../../../shared/models/Room";

const GET_PRIVATE_GROUP = "GET_PRIVATE_GROUP";
export const GET_PRIVATE_GROUP_SUCCESS = "GET_PRIVATE_GROUP_SUCCESS";
export const GET_PRIVATE_GROUP_FAILURE = "GET_PRIVATE_GROUP_FAILURE";
const GET_PRIVATE_GROUP_CANCELLED = "GET_PRIVATE_GROUP_CANCELLED";
export const getPrivateGroup = (team_id: string) => ({ type: GET_PRIVATE_GROUP, payload: team_id });
const getPrivateGroupSuccess = (payload) => ({ type: GET_PRIVATE_GROUP_SUCCESS, payload });
const getPrivateGroupFailure = (err) => ({ type: GET_PRIVATE_GROUP_FAILURE, payload: err });
const getPrivateGroupCancelled = () => ({ type: GET_PRIVATE_GROUP_CANCELLED });
export const getPrivateGroup_Epic = action$ => (
    action$.ofType(GET_PRIVATE_GROUP)
        .mergeMap(action => ajax.getJSON(`${config.api.group}/private_group`,
            { "x-access-token": Store.getState().authReducer.token })
            .map(response => getPrivateGroupSuccess(response))
            .takeUntil(action$.ofType(GET_PRIVATE_GROUP_CANCELLED))
            .catch(error => Rx.Observable.of(getPrivateGroupFailure(error.xhr.response)))
            .do(response => {
                if (response.type == GET_PRIVATE_GROUP_SUCCESS) {
                    const dataManager = BackendFactory.getInstance().dataManager;
                    let rooms = response.payload.result as Array<Room>;

                    Rx.Observable.from(rooms)._do(x => {
                        dataManager.roomDAL.save(x._id, x);
                    }).subscribe();
                }
            })
        ));


const CREATE_PRIVATE_GROUP = "CREATE_PRIVATE_GROUP";
export const CREATE_PRIVATE_GROUP_SUCCESS = "CREATE_PRIVATE_GROUP_SUCCESS";
export const CREATE_PRIVATE_GROUP_FAILURE = "CREATE_PRIVATE_GROUP_FAILURE";
const CREATE_PRIVATE_GROUP_CANCELLED = "CREATE_PRIVATE_GROUP_CANCELLED";
export const createPrivateGroup = (group: Room) => ({ type: CREATE_PRIVATE_GROUP, payload: group });
export const createPrivateGroupSuccess = (result) => ({ type: CREATE_PRIVATE_GROUP_SUCCESS, payload: result });
export const createPrivateGroupFailure = (error) => ({ type: CREATE_PRIVATE_GROUP_FAILURE, payload: error });
export const createPrivateGroupCancelled = () => ({ type: CREATE_PRIVATE_GROUP_CANCELLED });
export const createPrivateGroup_Epic = action$ => (
    action$.ofType(CREATE_PRIVATE_GROUP).mergeMap(action => ajax({
        method: "POST",
        url: `${config.api.group}/private_group/create`,
        body: JSON.stringify({ room: action.payload }),
        headers: {
            "Content-Type": "application/json",
            "x-access-token": Store.getState().authReducer.token
        }
    })
        .map(json => createPrivateGroupSuccess(json.response.result))
        .takeUntil(action$.ofType(CREATE_PRIVATE_GROUP_CANCELLED))
        .catch(error => Rx.Observable.of(createPrivateGroupFailure(error.xhr.response))))
);