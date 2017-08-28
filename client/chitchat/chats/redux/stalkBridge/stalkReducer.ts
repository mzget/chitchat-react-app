/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */

import * as StalkBridgeActions from "../stalkBridge/stalkBridgeActions";
import * as StalkNotificationActions from "./StalkNotificationActions";
import * as callingActions from "../../../calling/";

import { Record } from "immutable";

/**
 * ## Initial State
 */
/**
 * ## Form
 * This Record contains the state of the form and the
 * fields it contains.
 */
export const stalkInitState = {
    isInit: false,
    isFetching: false,
    state: null,
    incommingCall: null,
    inline: "",
    notiMessage: null,
    stalkToken: "",
    user: null
} as IStalkStoreParams;

// Define our record types with a typescript interface 
interface IStalkStoreParams {
    isInit: boolean;
    isFetching: boolean;
    state: string;
    incommingCall: any;
    inline: string;
    notiMessage: any;
    stalkToken: string;
    user: any;
}
// Create our Record class
export class StalkRecord extends Record(stalkInitState) {

    // Set the params. This will also typecheck when we instantiate a new FruitRecord
    constructor(params: IStalkStoreParams) {
        super(params);
    }

    // This following line is the magic. It overrides the "get" method of record
    // and lets typescript know the return type based on our IFruitParams interface
    get<T extends keyof IStalkStoreParams>(value: T): IStalkStoreParams[T] {

        // super.get() is mapped to the original get() function on Record
        return super.get(value)
    }

}
const initialState = new StalkRecord(stalkInitState);

export function stalkReducer(state = initialState, action) {
    if (!(state instanceof StalkRecord)) return initialState.mergeDeep(state);

    switch (action.type) {
        case StalkBridgeActions.STALK_INIT: {
            return state.set("isInit", false)
                .set("state", StalkBridgeActions.STALK_INIT);
        }
        case StalkBridgeActions.STALK_INIT_SUCCESS: {
            return state.set("isInit", true)
                .set("stalkToken", action.payload.token)
                .set("user", action.payload.user)
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

        case callingActions.VOIP_CALL_INCOMMING: {
            return state.set("incommingCall", action.payload);
        }
        case callingActions.ON_VIDEOCALL_ENDED: {
            return state.set("incommingCall", null).set("inline", null);
        }
        case callingActions.HANGUP_CALL_SUCCESS: {
            return state.set("incommingCall", null);
        }
        case callingActions.ON_CALLING: {
            return state.set("inline", action.payload);
        }

        case StalkNotificationActions.STALK_NOTICE_NEW_MESSAGE: {
            return state.set("notiMessage", action.payload);
        }
        default:
            return state;
    }
}