"use strict";
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
exports.__esModule = true;
var messageActions_1 = require("./messageActions");
var immutable_1 = require("immutable");
/**
 * ## Initial State
 */
/**
 * ## Form
 * This Record contains the state of the form and the
 * fields it contains.
 */
var Form = immutable_1.Record({
    selectRoom: null,
    disabled: false,
    error: null,
    isValid: false,
    isFetching: false,
    state: null
});
exports.MessageInitState = immutable_1.Record({
    form: new Form
});
var initialState = new exports.MessageInitState;
function messageReducer(state, action) {
    if (state === void 0) { state = initialState; }
    if (!(state instanceof exports.MessageInitState))
        return initialState.mergeDeep(state);
    switch (action.type) {
        case messageActions_1.MessageActionsType.STOP: {
            return state.setIn(["form", "state"], messageActions_1.MessageActionsType.STOP);
        }
        case messageActions_1.MessageActionsType.GET_ROOMID_REQUEST: {
            var nextState = state.setIn(["form", "state"], messageActions_1.MessageActionsType.GET_ROOMID_REQUEST)
                .setIn(["form", "isFetching"], true);
            return nextState;
        }
        case messageActions_1.MessageActionsType.GET_ROOMID_SUCCESS: {
            var roomInfo = action.payload;
            var nextState = state.setIn(["form", "state"], messageActions_1.MessageActionsType.GET_ROOMID_SUCCESS)
                .setIn(["form", "isFetching"], false)
                .setIn(["form", "selectRoom"], roomInfo);
            return nextState;
        }
        case messageActions_1.MessageActionsType.GET_ROOMID_FAILURE: {
            var nextState = state.setIn(["form", "state"], messageActions_1.MessageActionsType.GET_ROOMID_FAILURE)
                .setIn(["form", "isFetching"], false);
            return nextState;
        }
        default: return state;
    }
}
exports.messageReducer = messageReducer;
