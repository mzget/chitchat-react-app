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

import { combineReducers } from 'redux';

/**
* ## Reducers
*/
import { deviceReducer, DeviceInitialState } from "./device/deviceReducer";
import { teamReducer, TeamInitState } from "./team/teamRx";
import { UserInitState, userReducer } from "./user/userActions";
import { AuthenInitState, authReducer } from "./authen/authRx";
import { stalkReducer, StalkInitState } from "./stalkBridge/stalkReducer";
import { chatroomReducer, ChatRoomInitState } from "./chatroom/chatroomReducer";
import { chatlogReducer, ChatLogInitState } from "./chatlogs/chatlogReducer";

/**
 * ## CombineReducers
 *
 * the rootReducer will call each and every reducer with the state and action
 * EVERY TIME there is a basic action
 */
const appReducer = combineReducers({
    deviceReducer,
    authReducer,
    teamReducer,
    stalkReducer,
    chatroomReducer,
    chatlogReducer,
    userReducer
});

/*
 *
 * ## Initial state
 * Create instances for the keys of each structure in snowflake
 */
export function getInitialState() {
    const _initState = {
        deviceReducer: new DeviceInitialState(),
        teamReducer: new TeamInitState(),
        authReducer: new AuthenInitState(),
        stalkReducer: new StalkInitState(),
        chatroomReducer: new ChatRoomInitState(),
        chatlogReducer: new ChatLogInitState(),
        userReducer: new UserInitState()
    };
    return _initState;
}

export const rootReducer = (state, action) => {
    return appReducer(state, action)
}
