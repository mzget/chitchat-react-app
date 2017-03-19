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

import { combineReducers } from "redux";

import { STALK_ON_SOCKET_RECONNECT } from "./stalkBridge/stalkBridgeActions";

/**
* ## Reducers
*/
import { deviceReducer, DeviceInitialState } from "./device/deviceReducer";
import { teamReducer, TeamInitState } from "./team/teamRx";
import { UserInitState, userReducer } from "./user/userReducer";
import { AdminInitState, adminReducer } from "./admin/adminReducer";
import { AuthenInitState, authReducer, LOG_OUT_SUCCESS } from "./authen/authRx";
import { stalkReducer, StalkInitState } from "./stalkBridge/stalkReducer";
import { chatroomReducer, ChatRoomInitState } from "./chatroom/chatroomReducer";
import { chatlogReducer, ChatLogInitState } from "./chatlogs/chatlogReducer";

import { GroupInitState, groupReducer } from "./group/groupReducer";

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
    groupReducer,
    stalkReducer,
    chatroomReducer,
    chatlogReducer,
    userReducer,
    adminReducer,
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
        groupReducer: new GroupInitState(),
        authReducer: new AuthenInitState(),
        stalkReducer: new StalkInitState(),
        chatroomReducer: new ChatRoomInitState(),
        chatlogReducer: new ChatLogInitState(),
        userReducer: new UserInitState(),
        adminReducer: new AdminInitState(),
    };
    return _initState;
}

export const rootReducer = (state, action) => {
    if (state.authReducer.state === LOG_OUT_SUCCESS || state.stalkReducer.state == STALK_ON_SOCKET_RECONNECT) {
        state = getInitialState();
    }

    return appReducer(state, action);
};