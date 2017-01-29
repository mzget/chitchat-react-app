
import { Record } from "immutable";
import * as adminRx from "./adminRx";

export const AdminInitState = Record({
    isFetching: false,
    state: null,
    orgCharts: new Array()
});
const adminInitState = new AdminInitState();
export const adminReducer = (state = adminInitState, action) => {
    switch (action.type) {
        case adminRx.GET_ORG_CHART_SUCCESS: {
            return state.set("orgCharts", action.payload.result);
        }
        case adminRx.CREATE_NEW_ORG_CHART_SUCCESS: {
            let _temp: Array<any> = state.get("orgCharts");
            let _orgCharts = _temp.concat(action.payload);

            return state.set("orgCharts", _orgCharts)
                .set("state", adminRx.CREATE_NEW_ORG_CHART_SUCCESS);
        }
        default:
            return state;
    }
};