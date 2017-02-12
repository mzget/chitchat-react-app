"use strict";
const Rx = require("@reactivex/rxjs");
const { Observable: { ajax }, AjaxResponse } = Rx;
const config_1 = require("../../configs/config");
const configureStore_1 = require("../configureStore");
const BackendFactory_1 = require("../../chats/BackendFactory");
const GET_PRIVATE_GROUP = "GET_PRIVATE_GROUP";
exports.GET_PRIVATE_GROUP_SUCCESS = "GET_PRIVATE_GROUP_SUCCESS";
exports.GET_PRIVATE_GROUP_FAILURE = "GET_PRIVATE_GROUP_FAILURE";
const GET_PRIVATE_GROUP_CANCELLED = "GET_PRIVATE_GROUP_CANCELLED";
exports.getPrivateGroup = (team_id) => ({ type: GET_PRIVATE_GROUP, payload: team_id });
const getPrivateGroupSuccess = (payload) => ({ type: exports.GET_PRIVATE_GROUP_SUCCESS, payload });
const getPrivateGroupFailure = (err) => ({ type: exports.GET_PRIVATE_GROUP_FAILURE, payload: err });
const getPrivateGroupCancelled = () => ({ type: GET_PRIVATE_GROUP_CANCELLED });
exports.getPrivateGroup_Epic = action$ => (action$.ofType(GET_PRIVATE_GROUP)
    .mergeMap(action => ajax.getJSON(`${config_1.default.api.group}/private_group`, { "x-access-token": configureStore_1.default.getState().authReducer.token })
    .map(response => getPrivateGroupSuccess(response))
    .takeUntil(action$.ofType(GET_PRIVATE_GROUP_CANCELLED))
    .catch(error => Rx.Observable.of(getPrivateGroupFailure(error.xhr.response)))
    .do(response => {
    if (response.type == exports.GET_PRIVATE_GROUP_SUCCESS) {
        const dataManager = BackendFactory_1.default.getInstance().dataManager;
        let rooms = response.payload.result;
        Rx.Observable.from(rooms)._do(x => {
            dataManager.roomDAL.save(x._id, x);
        }).subscribe();
    }
})));
const CREATE_PRIVATE_GROUP = "CREATE_PRIVATE_GROUP";
exports.CREATE_PRIVATE_GROUP_SUCCESS = "CREATE_PRIVATE_GROUP_SUCCESS";
exports.CREATE_PRIVATE_GROUP_FAILURE = "CREATE_PRIVATE_GROUP_FAILURE";
const CREATE_PRIVATE_GROUP_CANCELLED = "CREATE_PRIVATE_GROUP_CANCELLED";
exports.createPrivateGroup = (group) => ({ type: CREATE_PRIVATE_GROUP, payload: group });
exports.createPrivateGroupSuccess = (result) => ({ type: exports.CREATE_PRIVATE_GROUP_SUCCESS, payload: result });
exports.createPrivateGroupFailure = (error) => ({ type: exports.CREATE_PRIVATE_GROUP_FAILURE, payload: error });
exports.createPrivateGroupCancelled = () => ({ type: CREATE_PRIVATE_GROUP_CANCELLED });
exports.createPrivateGroup_Epic = action$ => (action$.ofType(CREATE_PRIVATE_GROUP).mergeMap(action => ajax({
    method: "POST",
    url: `${config_1.default.api.group}/private_group/create`,
    body: JSON.stringify({ room: action.payload }),
    headers: {
        "Content-Type": "application/json",
        "x-access-token": configureStore_1.default.getState().authReducer.token
    }
})
    .map(json => exports.createPrivateGroupSuccess(json.response.result))
    .takeUntil(action$.ofType(CREATE_PRIVATE_GROUP_CANCELLED))
    .catch(error => Rx.Observable.of(exports.createPrivateGroupFailure(error.xhr.response)))));
