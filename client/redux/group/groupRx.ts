import config from "../../configs/config";
import { Record } from "immutable";

import * as Rx from "rxjs/Rx";
const { ajax } = Rx.Observable;

import Store from "../configureStore";

import BackendFactory from "../../chats/BackendFactory";
import { Room } from "../../../server/scripts/models/Room";

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
        .mergeMap(action => ajax.getJSON(`${config.api.group}/org?team_id=${action.payload}`,
            { "x-access-token": Store.getState().authReducer.token })
            .map(response => getOrgGroupSuccess(response))
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
        default:
            return state;
    }
};