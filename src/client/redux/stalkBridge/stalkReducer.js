/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
import * as ChatlogsActions from "../chatlogs/chatlogsActions";
import * as StalkBridgeActions from "../stalkBridge/stalkBridgeActions";
import { Record } from 'immutable';
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
    chatslogComponent: null,
    isFetching: false,
    state: null
});
const initialState = new StalkInitState();
export function stalkReducer(state = initialState, action) {
    if (!(state instanceof StalkInitState))
        return initialState.mergeDeep(state);
    switch (action.type) {
        case ChatlogsActions.STALK_INIT_CHATSLOG: {
            return state.set("isInit", true)
                .set("chatslogComponent", action.payload);
        }
        case StalkBridgeActions.STALK_INIT_FAILURE: {
            return state.set("state", StalkBridgeActions.STALK_INIT_FAILURE);
        }
        default:
            return state;
    }
}
