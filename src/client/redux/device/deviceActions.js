/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
/**
 * # deviceActions.js
 *
 * What platform are we running on, ie ```ios``` or ```android```
 *
 * What version is the app?
 *
 */
"use strict";
// import NotificationManager from '../../chats/notificationManager';
class DeviceActionsType {
}
DeviceActionsType.SET_PLATFORM = "SET_PLATFORM";
DeviceActionsType.SET_VERSION = "SET_VERSION";
DeviceActionsType.SET_APPSTATE = "SET_APPSTATE";
DeviceActionsType.SET_NETSTATE = "SET_NETSTATE";
DeviceActionsType.GET_DEVICETOKEN_SUCCESS = "GET_DEVICETOKEN_SUCCESS";
exports.DeviceActionsType = DeviceActionsType;
/**
 * ## Set the platformState
 *
 */
function setPlatform(platform) {
    return {
        type: DeviceActionsType.SET_PLATFORM,
        payload: platform
    };
}
exports.setPlatform = setPlatform;
/**
 * ## set the version
 *
 */
function setVersion(version) {
    return {
        type: DeviceActionsType.SET_VERSION,
        payload: version
    };
}
exports.setVersion = setVersion;
function setAppState(appState) {
    return {
        type: DeviceActionsType.SET_APPSTATE,
        payload: appState
    };
}
exports.setAppState = setAppState;
function setNetState(netState) {
    return {
        type: DeviceActionsType.SET_NETSTATE,
        payload: netState
    };
}
exports.setNetState = setNetState;
function getDeviceTokenSuccess(deviceToken) {
    return {
        type: DeviceActionsType.GET_DEVICETOKEN_SUCCESS,
        payload: deviceToken
    };
}
function initNotificationService() {
    return (dispatch) => {
        /*
        NotificationManager.getInstance().init((err, tokenData) => {
          dispatch(getDeviceTokenSuccess(tokenData));
        });
    
        if (process.env.NODE_ENV === `development`) {
          dispatch(getDeviceTokenSuccess(null));
        }
        */
    };
}
exports.initNotificationService = initNotificationService;
