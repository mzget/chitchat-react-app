/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 *
 * # deviceReducer.js
 *
 */
"use strict";
/**
 * ## Import immutable record
 */
const immutable_1 = require("immutable");
const deviceActions_1 = require("./deviceActions");
/**
 * ## InitialState
 *
 * The fields we're concerned with
 */
exports.DeviceInitialState = immutable_1.Record({
    isMobile: false,
    platform: '',
    version: null,
    appState: null,
    netState: null,
    deviceToken: null,
    os: null,
    state: null
});
const initialState = new exports.DeviceInitialState;
/**
 * ## deviceReducer function
 * @param {Object} state - initialState
 * @param {Object} action - type and payload
 */
function deviceReducer(state = initialState, action) {
    if (!(state instanceof exports.DeviceInitialState))
        return initialState.merge(state);
    switch (action.type) {
        /**
         * ### set the platform in the state
         *
         */
        case deviceActions_1.DeviceActionsType.SET_PLATFORM: {
            const platform = action.payload;
            return state.set('platform', platform);
        }
        /**
         * ### set the version in the state
         *
         */
        case deviceActions_1.DeviceActionsType.SET_VERSION: {
            const version = action.payload;
            return state.set('version', version);
        }
        case deviceActions_1.DeviceActionsType.SET_APPSTATE: {
            const appState = action.payload;
            return state.set('appState', appState);
        }
        case deviceActions_1.DeviceActionsType.SET_NETSTATE: {
            const payload = action.payload;
            return state.set("netState", payload);
        }
        case deviceActions_1.DeviceActionsType.GET_DEVICETOKEN_SUCCESS: {
            const tokenData = action.payload; //{ deviceToken: deviceToken.token, os: deviceToken.os }
            if (tokenData != null) {
                let deviceToken = tokenData.token;
                let os = tokenData.os;
                return state.set("deviceToken", deviceToken)
                    .set("os", os)
                    .set("state", deviceActions_1.DeviceActionsType.GET_DEVICETOKEN_SUCCESS);
            }
            else
                return state.set("state", deviceActions_1.DeviceActionsType.GET_DEVICETOKEN_SUCCESS);
        }
        default:
            return state;
    }
}
exports.deviceReducer = deviceReducer;
