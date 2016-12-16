/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 *
 * # rootReducer.ts
 *
 * A Redux boilerplate setup
 *
 */

import { createStore, combineReducers, applyMiddleware } from 'redux';

/**
* ## Reducers
*/
// import { messageReducer, MessageInitState } from "./message/messageReducer";
import { stalkReducer, StalkInitState } from "./stalkBridge/stalkReducer";
import { chatRoomReducer, ChatRoomInitState } from "./chatroom/chatroomReducer";

/**
 * ## CombineReducers
 *
 * the rootReducer will call each and every reducer with the state and action
 * EVERY TIME there is a basic action
 */
const appReducer = combineReducers({
    // messageReducer,
    stalkReducer,
    chatRoomReducer,
});

/*
 *
 * ## Initial state
 * Create instances for the keys of each structure in snowflake
 */
export function getInitialState() {
    const _initState = {
        // Initial state for any reducer.
        // messageReducer: new MessageInitState,
        stalkReducer: new StalkInitState(),
        chatRoomReducer: new ChatRoomInitState(),

    };
    return _initState;
}

export const rootReducer = (state, action) => {
    console.log("rootReducer", action.type, action.payload);

    return appReducer(state, action)
}
