"use strict";
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 *
 * # deviceReducer.js
 *
 */
exports.__esModule = true;
/**
 * ## Import immutable record
 */
var immutable_1 = require("immutable");
var deviceActions_1 = require("./deviceActions");
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
var initialState = new exports.DeviceInitialState;
/**
 * ## deviceReducer function
 * @param {Object} state - initialState
 * @param {Object} action - type and payload
 */
function deviceReducer(state, action) {
    if (state === void 0) { state = initialState; }
    if (!(state instanceof exports.DeviceInitialState))
        return initialState.merge(state);
    switch (action.type) {
        /**
         * ### set the platform in the state
         *
         */
        case deviceActions_1.DeviceActionsType.SET_PLATFORM: {
            var platform = action.payload;
            return state.set('platform', platform);
        }
        /**
         * ### set the version in the state
         *
         */
        case deviceActions_1.DeviceActionsType.SET_VERSION: {
            var version = action.payload;
            return state.set('version', version);
        }
        case deviceActions_1.DeviceActionsType.SET_APPSTATE: {
            var appState = action.payload;
            return state.set('appState', appState);
        }
        case deviceActions_1.DeviceActionsType.SET_NETSTATE: {
            var payload = action.payload;
            return state.set("netState", payload);
        }
        case deviceActions_1.DeviceActionsType.GET_DEVICETOKEN_SUCCESS: {
            var tokenData = action.payload; //{ deviceToken: deviceToken.token, os: deviceToken.os }
            if (tokenData != null) {
                var deviceToken = tokenData.token;
                var os = tokenData.os;
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
