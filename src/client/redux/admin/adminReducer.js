"use strict";
const immutable_1 = require("immutable");
const adminRx = require("./adminRx");
exports.AdminInitState = immutable_1.Record({
    isFetching: false,
    state: null,
    error: null,
    orgCharts: new Array()
});
const adminInitState = new exports.AdminInitState();
exports.adminReducer = (state = adminInitState, action) => {
    switch (action.type) {
        case adminRx.GET_ORG_CHART_SUCCESS: {
            return state.set("orgCharts", action.payload.result);
        }
        case adminRx.CREATE_NEW_ORG_CHART_SUCCESS: {
            let _temp = state.get("orgCharts");
            let _orgCharts = _temp.concat(action.payload);
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
        case adminRx.ADMIN_RX_EMPTY_STATE: {
            return state.set("state", adminRx.ADMIN_RX_EMPTY_STATE)
                .set("error", null);
        }
        default:
            return state;
    }
};
