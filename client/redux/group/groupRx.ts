import config from "../../configs/config";
import { Record } from "immutable";
import { createAction } from "redux-actions";
import * as Rx from "rxjs/Rx";
const { ajax } = Rx.Observable;

import Store from "../configureStore";

import BackendFactory from "../../chats/BackendFactory";
import { Room, RoomType } from "../../../server/scripts/models/Room";

const GET_ORG_GROUP = "GET_ORG_GROUP";
const GET_ORG_GROUP_SUCCESS = "GET_ORG_GROUP_SUCCESS";
const GET_ORG_GROUP_FAILURE = "GET_ORG_GROUP_FAILURE";
const GET_ORG_GROUP_CANCELLED = "GET_ORG_GROUP_CANCELLED";
export const getOrgGroup = (team_id: string) => ({ type: GET_ORG_GROUP, payload: team_id });
const getOrgGroupSuccess = (payload) => ({ type: GET_ORG_GROUP_SUCCESS, payload });
const getOrgGroupFailure = (err) => ({ type: GET_ORG_GROUP_FAILURE, payload: err });
const getOrgGroupCancelled = () => ({ type: GET_ORG_GROUP_CANCELLED });
export const getOrgGroup_Epic = action$ => (
    action$.ofType(GET_ORG_GROUP).mergeMap(action =>
        ajax.getJSON(
            `${config.api.group}/org?team_id=${action.payload}`,
            { "x-access-token": Store.getState().authReducer.token }
        ).map(response => getOrgGroupSuccess(response))
            .takeUntil(action$.ofType(GET_ORG_GROUP_CANCELLED))
            .catch(error => Rx.Observable.of(getOrgGroupFailure(error.xhr.response)))
            .do(response => {
                if (response.type == GET_ORG_GROUP_SUCCESS) {
                    const dataManager = BackendFactory.getInstance().dataManager;
                    let rooms = response.payload.result as Array<Room>;

                    Rx.Observable.from(rooms)._do(x => {
                        dataManager.roomDAL.save(x._id, x);
                    }).subscribe();
                }
            })
    ));


const CREATE_ORG_GROUP = "CREATE_ORG_GROUP";
export const CREATE_ORG_GROUP_FAILURE = "CREATE_ORG_GROUP_FAILURE";
export const CREATE_ORG_GROUP_SUCCESS = "CREATE_ORG_GROUP_SUCCESS";
const CREATE_ORG_GROUP_CANCELLED = "CREATE_ORG_GROUP_CANCELLED";
export const createOrgGroup = (group) => ({ type: CREATE_ORG_GROUP, payload: group });
const createOrgGroupSuccess = createAction(CREATE_ORG_GROUP_SUCCESS, payload => payload);
const createOrgGroupFailure = createAction(CREATE_ORG_GROUP_FAILURE, err => err);
const createOrgGroupCancelled = createAction(CREATE_ORG_GROUP_CANCELLED);
export const createOrgGroup_Epic = action$ => (
    action$.ofType(CREATE_ORG_GROUP).mergeMap(action => ajax({
        method: "POST",
        url: `${config.api.group}/org/create`,
        body: JSON.stringify({ room: action.payload }),
        headers: {
            "Content-Type": "application/json",
            "x-access-token": Store.getState().authReducer.token
        }
    }).map(json => createOrgGroupSuccess(json.response.result))
        .takeUntil(action$.ofType(CREATE_ORG_GROUP_CANCELLED))
        .catch(error => Rx.Observable.of(createOrgGroupFailure(error.xhr.response))))
);

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

const GROUP_RX_EMPTY_STATE = "GROUP_RX_EMPTY_STATE";
export const emptyState = () => ({ type: GROUP_RX_EMPTY_STATE });

export const GroupInitState = Record({
    isFetching: false,
    state: null,
    error: null,
    orgGroups: null,
    privateGroups: null,
});
export const groupReducer = (state = new GroupInitState(), action) => {
    switch (action.type) {
        case GET_ORG_GROUP_SUCCESS: {
            return state.set("orgGroups", action.payload.result);
        }

        case CREATE_ORG_GROUP_SUCCESS: {
            let group = action.payload as Array<Room>;
            if (group && group.length > 0) {
                if (group[0].type == RoomType.organizationGroup) {
                    let prev = state.get("orgGroups") as Array<Room>;
                    let _next = prev.concat(group);

                    return state.set("orgGroups", _next)
                        .set("state", CREATE_ORG_GROUP_SUCCESS);
                }
                else return state;
            }

            return state;
        }
        case CREATE_ORG_GROUP_FAILURE: {
            return state.set("state", CREATE_ORG_GROUP_FAILURE)
                .set("error", action.payload.message);
        }

        case CREATE_PRIVATE_GROUP_SUCCESS: {
            let group = action.payload as Array<Room>;
            if (group && group.length > 0) {
                if (group[0].type == RoomType.privateGroup) {
                    let prev = state.get("privateGroups") as Array<Room>;
                    let _next = prev.concat(group);

                    return state.set("privateGroups", _next)
                        .set("state", CREATE_PRIVATE_GROUP_SUCCESS);
                }
                else return state;
            }

            return state;
        }
        case CREATE_PRIVATE_GROUP_FAILURE: {
            return state.set("state", CREATE_PRIVATE_GROUP_FAILURE)
                .set("error", action.payload.message);
        }

        case GROUP_RX_EMPTY_STATE: {
            return state.set("state", GROUP_RX_EMPTY_STATE).set("error", null);
        }
        default:
            return state;
    }
};