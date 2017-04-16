import { Record } from "immutable";

import {
    UPLOAD_USER_AVATAR_FAILURE,
    FETCH_USER_FAILURE,
    UPDATE_USER_INFO_FAILURE
} from "../user/userRx";
import * as authRx from "../authen/authRx";
import { UPDATE_LAST_ACCESS_ROOM_FAILURE } from "../../chitchat/chats/redux/chatlogs/chatlogRxActions";

export const CLEAR_ALERT = "CLEAR_ALERT";

export const AlertInitState = Record({
    error: null
});
export const alertReducer = (state = new AlertInitState(), action: ReduxActions.Action<any>) => {
    switch (action.type) {
        /**
         * User reducer.
         */
        case UPLOAD_USER_AVATAR_FAILURE: {
            return state.set("error", action.payload.message.toString());
        }
        case FETCH_USER_FAILURE: {
            return state.set("error", action.payload.message);
        }
        case UPDATE_USER_INFO_FAILURE: {
            return state.set("error", action.payload.message);
        }

        /**
         * Auth reducer.
         */
        case authRx.SIGN_UP_FAILURE:
            return state.set("error", action.payload);
        case authRx.AUTH_USER_FAILURE: {
            return state.set("error", JSON.stringify(action.payload));
        }
        case authRx.TOKEN_AUTH_USER_FAILURE: {
            return state.set("error", action.payload);
        }
        case authRx.AUTH_REDUCER_CLEAR_ERROR: {
            return state.set("error", null);
        }

        /**
         * Chatlog reducer...
         */
        case UPDATE_LAST_ACCESS_ROOM_FAILURE: {
            return state.set("error", action.payload.message);
        }

        case CLEAR_ALERT:
            return state.set("error", null);

        default:
            return state;
    }
};