"use strict";
const immutable_1 = require("immutable");
const adminRx = require("./adminRx");
exports.AdminInitState = immutable_1.Record({
    isFetching: false,
    state: null,
    orgCharts: new Array()
});
const adminInitState = new exports.AdminInitState();
exports.adminReducer = (state = adminInitState, action) => {
    switch (action.type) {
        case adminRx.GET_ORG_CHART_SUCCESS: {
            return state.set("orgCharts", action.payload.result);
        }
        default:
            return state;
    }
};
