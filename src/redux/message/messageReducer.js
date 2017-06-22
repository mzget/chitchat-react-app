/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
import { MessageActionsType } from "./messageActions";
import { Record } from 'immutable';
/**
 * ## Initial State
 */
/**
 * ## Form
 * This Record contains the state of the form and the
 * fields it contains.
 */
const Form = Record({
    selectRoom: null,
    disabled: false,
    error: null,
    isValid: false,
    isFetching: false,
    state: null
});
export var MessageInitState = Record({
    form: new Form
});
const initialState = new MessageInitState;
export function messageReducer(state = initialState, action) {
    if (!(state instanceof MessageInitState))
        return initialState.mergeDeep(state);
    switch (action.type) {
        case MessageActionsType.STOP: {
            return state.setIn(["form", "state"], MessageActionsType.STOP);
        }
        case MessageActionsType.GET_ROOMID_REQUEST: {
            let nextState = state.setIn(["form", "state"], MessageActionsType.GET_ROOMID_REQUEST)
                .setIn(["form", "isFetching"], true);
            return nextState;
        }
        case MessageActionsType.GET_ROOMID_SUCCESS: {
            let roomInfo = action.payload;
            let nextState = state.setIn(["form", "state"], MessageActionsType.GET_ROOMID_SUCCESS)
                .setIn(["form", "isFetching"], false)
                .setIn(["form", "selectRoom"], roomInfo);
            return nextState;
        }
        case MessageActionsType.GET_ROOMID_FAILURE: {
            let nextState = state.setIn(["form", "state"], MessageActionsType.GET_ROOMID_FAILURE)
                .setIn(["form", "isFetching"], false);
            return nextState;
        }
        default: return state;
    }
}
