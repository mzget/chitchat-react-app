"use strict";
var immutable_1 = require("immutable");
var adminRx = require("./adminRx");
exports.AdminInitState = immutable_1.Record({
    isFetching: false,
    state: null,
    error: null,
    orgCharts: new Array()
});
var adminInitState = new exports.AdminInitState();
exports.adminReducer = function (state, action) {
    if (state === void 0) { state = adminInitState; }
    switch (action.type) {
        case adminRx.GET_ORG_CHART_SUCCESS: {
            return state.set("orgCharts", action.payload.result);
        }
        case adminRx.CREATE_NEW_ORG_CHART_SUCCESS: {
            var _temp = state.get("orgCharts");
            var _orgCharts = _temp.concat(action.payload);
            return state.set("orgCharts", _orgCharts)
                .set("state", adminRx.CREATE_NEW_ORG_CHART_SUCCESS);
        }
        case adminRx.UPDATE_USER_ORG_CHART_SUCCESS: {
            return state.set("state", adminRx.UPDATE_USER_ORG_CHART_SUCCESS);
        }
        case adminRx.UPDATE_USER_ORG_CHART_FAILURE: {
            return state.set("state", adminRx.UPDATE_USER_ORG_CHART_FAILURE)
                .set("error", JSON.stringify(action.payload.message));
        }
        case adminRx.UPDATE_USER_TEAM_ROLE_SUCCESS: {
            return state.set("state", adminRx.UPDATE_USER_TEAM_ROLE_SUCCESS);
        }
        case adminRx.ADMIN_RX_EMPTY_STATE: {
            return state.set("state", adminRx.ADMIN_RX_EMPTY_STATE)
                .set("error", null);
        }
        default:
            return state;
    }
};
