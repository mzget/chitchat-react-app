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
"use strict";
const redux_1 = require("redux");
/**
* ## Reducers
*/
const deviceReducer_1 = require("./device/deviceReducer");
const teamRx_1 = require("./team/teamRx");
const userRx_1 = require("./user/userRx");
const authRx_1 = require("./authen/authRx");
const groupRx_1 = require("./group/groupRx");
const stalkReducer_1 = require("./stalkBridge/stalkReducer");
const chatroomReducer_1 = require("./chatroom/chatroomReducer");
const chatlogReducer_1 = require("./chatlogs/chatlogReducer");
/**
 * ## CombineReducers
 *
 * the rootReducer will call each and every reducer with the state and action
 * EVERY TIME there is a basic action
 */
const appReducer = redux_1.combineReducers({
    deviceReducer: deviceReducer_1.deviceReducer,
    authReducer: authRx_1.authReducer,
    teamReducer: teamRx_1.teamReducer,
    groupReducer: groupRx_1.groupReducer,
    stalkReducer: stalkReducer_1.stalkReducer,
    chatroomReducer: chatroomReducer_1.chatroomReducer,
    chatlogReducer: chatlogReducer_1.chatlogReducer,
    userReducer: userRx_1.userReducer
});
/*
 *
 * ## Initial state
 * Create instances for the keys of each structure in snowflake
 */
function getInitialState() {
    const _initState = {
        deviceReducer: new deviceReducer_1.DeviceInitialState(),
        teamReducer: new teamRx_1.TeamInitState(),
        groupReducer: new groupRx_1.GroupInitState(),
        authReducer: new authRx_1.AuthenInitState(),
        stalkReducer: new stalkReducer_1.StalkInitState(),
        chatroomReducer: new chatroomReducer_1.ChatRoomInitState(),
        chatlogReducer: new chatlogReducer_1.ChatLogInitState(),
        userReducer: new userRx_1.UserInitState()
    };
    return _initState;
}
exports.getInitialState = getInitialState;
exports.rootReducer = (state, action) => {
    if (state.authReducer.state === authRx_1.LOG_OUT_SUCCESS) {
        state = getInitialState();
    }
    return appReducer(state, action);
};
