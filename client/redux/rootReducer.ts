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

import * as rootRxEpic from "./rootRxEpic";
/**
* ## Reducers
*/
// import { messageReducer, MessageInitState } from "./message/messageReducer";
import { UserInitState, usersReducer } from "./user/userActions";
import { stalkReducer, StalkInitState } from "./stalkBridge/stalkReducer";
import { chatroomReducer, ChatRoomInitState } from "./chatroom/chatroomRxEpic";

/**
 * ## CombineReducers
 *
 * the rootReducer will call each and every reducer with the state and action
 * EVERY TIME there is a basic action
 */
const appReducer = combineReducers({
    // messageReducer,
    stalkReducer,
    chatroomReducer,
    usersReducer
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
        chatroomReducer: new ChatRoomInitState(),
        usersReducer: new UserInitState()
    };
    return _initState;
}

export const rootReducer = (state, action) => {
    return appReducer(state, action)
}
