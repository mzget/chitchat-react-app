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
var redux_1 = require("redux");
var reapop_1 = require("reapop");
var authRx_1 = require("./authen/authRx");
var stalkBridgeActions_1 = require("../chitchat/chats/redux/stalkBridge/stalkBridgeActions");
/**
* ## Reducers
*/
var deviceReducer_1 = require("./device/deviceReducer");
var teamRx_1 = require("./team/teamRx");
var userReducer_1 = require("./user/userReducer");
var adminReducer_1 = require("./admin/adminReducer");
var authReducer_1 = require("./authen/authReducer");
var groupReducer_1 = require("./group/groupReducer");
var stalkReducer_1 = require("../chitchat/chats/redux/stalkBridge/stalkReducer");
var chatroomReducer_1 = require("../chitchat/chats/redux/chatroom/chatroomReducer");
var chatlogReducer_1 = require("../chitchat/chats/redux/chatlogs/chatlogReducer");
var alertReducer_1 = require("./app/alertReducer");
/**
 * ## CombineReducers
 *
 * the rootReducer will call each and every reducer with the state and action
 * EVERY TIME there is a basic action
 */
var appReducer = redux_1.combineReducers({
    deviceReducer: deviceReducer_1.deviceReducer,
    authReducer: authReducer_1.authReducer,
    teamReducer: teamRx_1.teamReducer,
    groupReducer: groupReducer_1.groupReducer,
    stalkReducer: stalkReducer_1.stalkReducer,
    chatroomReducer: chatroomReducer_1.chatroomReducer,
    chatlogReducer: chatlogReducer_1.chatlogReducer,
    userReducer: userReducer_1.userReducer,
    adminReducer: adminReducer_1.adminReducer,
    alertReducer: alertReducer_1.alertReducer,
    notifications: reapop_1.reducer()
});
/*
 *
 * ## Initial state
 * Create instances for the keys of each structure in snowflake
 */
function getInitialState() {
    var _initState = {
        deviceReducer: new deviceReducer_1.DeviceInitialState(),
        teamReducer: new teamRx_1.TeamInitState(),
        groupReducer: new groupReducer_1.GroupInitState(),
        authReducer: new authReducer_1.AuthenInitState(),
        stalkReducer: new stalkReducer_1.StalkInitState(),
        chatroomReducer: new chatroomReducer_1.ChatRoomInitState(),
        chatlogReducer: new chatlogReducer_1.ChatLogInitState(),
        userReducer: new userReducer_1.UserInitState(),
        adminReducer: new adminReducer_1.AdminInitState(),
        alertReducer: new alertReducer_1.AlertInitState()
    };
    return _initState;
}
exports.getInitialState = getInitialState;
exports.rootReducer = function (state, action) {
    if (state.authReducer.state === authRx_1.LOG_OUT_SUCCESS || state.stalkReducer.state == stalkBridgeActions_1.STALK_ON_SOCKET_RECONNECT) {
        state = getInitialState();
    }
    return appReducer(state, action);
};
