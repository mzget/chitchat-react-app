/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */

import * as StalkBridgeActions from "../stalkBridge/stalkBridgeActions";
import * as StalkNotificationActions from "./StalkNotificationActions";

import { Record } from "immutable";

/**
 * ## Initial State
 */
/**
 * ## Form
 * This Record contains the state of the form and the
 * fields it contains.
 */
export const StalkInitState = Record({
    isInit: false,
    isFetching: false,
    state: null,
    notiMessage: "",
    stalkToken: ""
});
const initialState = new StalkInitState();

export function stalkReducer(state = initialState, action) {
    if (!(state instanceof StalkInitState)) return initialState.mergeDeep(state);

    switch (action.type) {
        case StalkBridgeActions.STALK_INIT: {
            return state.set("isInit", false)
                .set("state", StalkBridgeActions.STALK_INIT);
        }
        case StalkBridgeActions.STALK_INIT_SUCCESS: {
            return state.set("isInit", true)
                .set("stalkToken", action.payload)
                .set("state", StalkBridgeActions.STALK_INIT_SUCCESS);
        }
        case StalkBridgeActions.STALK_INIT_FAILURE: {
            return state.set("isInit", true)
                .set("state", StalkBridgeActions.STALK_CONNECTION_PROBLEM);
        }
        case StalkBridgeActions.STALK_ON_SOCKET_CLOSE: {
            return state.set("state", StalkBridgeActions.STALK_CONNECTION_PROBLEM);
        }
        case StalkBridgeActions.STALK_ON_SOCKET_DISCONNECTED: {
            return state.set("state", StalkBridgeActions.STALK_CONNECTION_PROBLEM);
        }
        case StalkBridgeActions.STALK_ON_SOCKET_RECONNECT: {
            return state.set("state", StalkBridgeActions.STALK_ON_SOCKET_RECONNECT);
        }

        case StalkNotificationActions.STALK_NOTICE_NEW_MESSAGE: {
            return state.set("notiMessage", action.payload);
        }
        default:
            return state;
    }
}