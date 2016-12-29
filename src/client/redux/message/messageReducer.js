/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
"use strict";
const messageActions_1 = require("./messageActions");
const immutable_1 = require("immutable");
/**
 * ## Initial State
 */
/**
 * ## Form
 * This Record contains the state of the form and the
 * fields it contains.
 */
const Form = immutable_1.Record({
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
const initialState = new exports.MessageInitState;
function messageReducer(state = initialState, action) {
    if (!(state instanceof exports.MessageInitState))
        return initialState.mergeDeep(state);
    switch (action.type) {
        case messageActions_1.MessageActionsType.STOP: {
            return state.setIn(["form", "state"], messageActions_1.MessageActionsType.STOP);
        }
        case messageActions_1.MessageActionsType.GET_ROOMID_REQUEST: {
            let nextState = state.setIn(["form", "state"], messageActions_1.MessageActionsType.GET_ROOMID_REQUEST)
                .setIn(["form", "isFetching"], true);
            return nextState;
        }
        case messageActions_1.MessageActionsType.GET_ROOMID_SUCCESS: {
            let roomInfo = action.payload;
            let nextState = state.setIn(["form", "state"], messageActions_1.MessageActionsType.GET_ROOMID_SUCCESS)
                .setIn(["form", "isFetching"], false)
                .setIn(["form", "selectRoom"], roomInfo);
            return nextState;
        }
        case messageActions_1.MessageActionsType.GET_ROOMID_FAILURE: {
            let nextState = state.setIn(["form", "state"], messageActions_1.MessageActionsType.GET_ROOMID_FAILURE)
                .setIn(["form", "isFetching"], false);
            return nextState;
        }
        default: return state;
    }
}
exports.messageReducer = messageReducer;
