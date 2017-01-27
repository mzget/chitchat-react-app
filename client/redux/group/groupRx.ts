import config from "../../configs/config";
import { Record } from "immutable";
import { createAction } from "redux-actions";
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

const CREATE_ORG_GROUP = "CREATE_ORG_GROUP";
const CREATE_ORG_GROUP_FAILURE = "CREATE_ORG_GROUP_FAILURE";
const CREATE_ORG_GROUP_SUCCESS = "CREATE_ORG_GROUP_SUCCESS";
const CREATE_ORG_GROUP_CANCELLED = "CREATE_ORG_GROUP_CANCELLED";
const createOrgGroup = createAction(CREATE_ORG_GROUP, group => group);
const createOrgGroupSuccess = createAction(CREATE_ORG_GROUP_SUCCESS, payload => payload);
const createOrgGroupFailure = createAction(CREATE_ORG_GROUP_FAILURE, err => err);
const createOrgGroupCancelled = createAction(CREATE_ORG_GROUP_CANCELLED);
// export const createOrgGroupEpic = action$ => (
//     action$.ofType(FETCH_AGENT_BY_ID)
//         .margeMap(action => ajax.getJSON(`${config.api.user}/agent/${action.payload}`)
//             .map(fetchAgentByIdSuccess)
//             .takeUntil(action$.ofType(FETCH_AGENT_BY_ID_CANCELLED))
//             .catch(error => Rx.Observable.of(fetchAgentByIdFailure(error.xhr.response))))
// );

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