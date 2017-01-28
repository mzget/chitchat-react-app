"use strict";
const config_1 = require("../../configs/config");
const immutable_1 = require("immutable");
const redux_actions_1 = require("redux-actions");
const Rx = require("@reactivex/rxjs");
const { ajax } = Rx.Observable;
const configureStore_1 = require("../configureStore");
const BackendFactory_1 = require("../../chats/BackendFactory");
const GET_ORG_GROUP = "GET_ORG_GROUP";
const GET_ORG_GROUP_SUCCESS = "GET_ORG_GROUP_SUCCESS";
const GET_ORG_GROUP_FAILURE = "GET_ORG_GROUP_FAILURE";
const GET_ORG_GROUP_CANCELLED = "GET_ORG_GROUP_CANCELLED";
exports.getOrgGroup = (team_id) => ({ type: GET_ORG_GROUP, payload: team_id });
const getOrgGroupSuccess = (payload) => ({ type: GET_ORG_GROUP_SUCCESS, payload });
const getOrgGroupFailure = (err) => ({ type: GET_ORG_GROUP_FAILURE, payload: err });
const getOrgGroupCancelled = () => ({ type: GET_ORG_GROUP_CANCELLED });
exports.getOrgGroupEpic = action$ => (action$.ofType(GET_ORG_GROUP)
    .mergeMap(action => ajax.getJSON(`${config_1.default.api.group}/org?team_id=${action.payload}`, { "x-access-token": configureStore_1.default.getState().authReducer.token })
    .map(response => getOrgGroupSuccess(response))
    .takeUntil(action$.ofType(GET_ORG_GROUP_CANCELLED))
    .catch(error => Rx.Observable.of(getOrgGroupFailure(error.xhr.response)))
    .do(response => {
    if (response.type === GET_ORG_GROUP_SUCCESS) {
        const dataManager = BackendFactory_1.default.getInstance().dataManager;
        let rooms = response.payload.result;
        Rx.Observable.from(rooms)._do(x => {
            dataManager.roomDAL.save(x._id, x);
        }).subscribe();
    }
})));
const CREATE_ORG_GROUP = "CREATE_ORG_GROUP";
const CREATE_ORG_GROUP_FAILURE = "CREATE_ORG_GROUP_FAILURE";
const CREATE_ORG_GROUP_SUCCESS = "CREATE_ORG_GROUP_SUCCESS";
const CREATE_ORG_GROUP_CANCELLED = "CREATE_ORG_GROUP_CANCELLED";
const createOrgGroup = redux_actions_1.createAction(CREATE_ORG_GROUP, group => group);
const createOrgGroupSuccess = redux_actions_1.createAction(CREATE_ORG_GROUP_SUCCESS, payload => payload);
const createOrgGroupFailure = redux_actions_1.createAction(CREATE_ORG_GROUP_FAILURE, err => err);
const createOrgGroupCancelled = redux_actions_1.createAction(CREATE_ORG_GROUP_CANCELLED);
exports.createOrgGroupEpic = action$ => (action$.ofType(CREATE_ORG_GROUP)
    .margeMap(action => ajax.getJSON(`${config_1.default.api.group}/createOrg/${action.payload}`)
    .map(createOrgGroupSuccess)
    .takeUntil(action$.ofType(CREATE_ORG_GROUP_CANCELLED))
    .catch(error => Rx.Observable.of(createOrgGroupFailure(error.xhr.response)))));
exports.GroupInitState = immutable_1.Record({
    isFetching: false,
    state: null,
    orgGroups: null
});
exports.groupReducer = (state = new exports.GroupInitState(), action) => {
    switch (action.type) {
        case GET_ORG_GROUP_SUCCESS: {
            return state.set("orgGroups", action.payload.result);
        }
        default:
            return state;
    }
};
