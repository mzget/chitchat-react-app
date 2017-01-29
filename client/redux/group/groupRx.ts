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
export const getOrgGroupEpic = action$ => (
    action$.ofType(GET_ORG_GROUP)
        .mergeMap(action =>
            ajax.getJSON(
                `${config.api.group}/org?team_id=${action.payload}`,
                { "x-access-token": Store.getState().authReducer.token }
            ).map(response => getOrgGroupSuccess(response))
                .takeUntil(action$.ofType(GET_ORG_GROUP_CANCELLED))
                .catch(error => Rx.Observable.of(getOrgGroupFailure(error.xhr.response)))
                .do(response => {
                    if (response.type === GET_ORG_GROUP_SUCCESS) {
                        const dataManager = BackendFactory.getInstance().dataManager;
                        let rooms = response.payload.result as Array<Room>;

                        Rx.Observable.from(rooms)._do(x => {
                            dataManager.roomDAL.save(x._id, x);
                        }).subscribe();
                    }
                })
        ));

const CREATE_GROUP = "CREATE_GROUP";
const CREATE_GROUP_FAILURE = "CREATE_GROUP_FAILURE";
export const CREATE_GROUP_SUCCESS = "CREATE_GROUP_SUCCESS";
const CREATE_GROUP_CANCELLED = "CREATE_GROUP_CANCELLED";
export const createGroup = createAction(CREATE_GROUP, group => group);
const createGroupSuccess = createAction(CREATE_GROUP_SUCCESS, payload => payload);
const createGroupFailure = createAction(CREATE_GROUP_FAILURE, err => err);
const createGroupCancelled = createAction(CREATE_GROUP_CANCELLED);
export const createGroupEpic = action$ => (
    action$.ofType(CREATE_GROUP)
        .mergeMap(action => ajax({
            method: "POST",
            url: `${config.api.group}/create`,
            body: JSON.stringify({ room: action.payload }),
            headers: {
                "Content-Type": "application/json",
                "x-access-token": Store.getState().authReducer.token
            }
        }).map(json => createGroupSuccess(json.response.result))
            .takeUntil(action$.ofType(CREATE_GROUP_CANCELLED))
            .catch(error => Rx.Observable.of(createGroupFailure(error.xhr.response))))
);

export const GroupInitState = Record({
    isFetching: false,
    state: null,
    orgGroups: null
});
export const groupReducer = (state = new GroupInitState(), action) => {
    switch (action.type) {
        case GET_ORG_GROUP_SUCCESS: {
            return state.set("orgGroups", action.payload.result);
        }
        case CREATE_GROUP_SUCCESS: {
            let group = action.payload as Array<Room>;
            if (group && group.length > 0) {
                if (group[0].type === RoomType.organizationGroup) {
                    let prev = state.get("orgGroups") as Array<Room>;
                    let _next = prev.concat(group);

                    return state.set("orgGroups", _next)
                        .set("state", CREATE_GROUP_SUCCESS);
                }
                else return state;
            }

            return state;
        }
        default:
            return state;
    }
};