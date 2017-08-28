import { CallingEvents } from "stalk-js";
import { Observable } from "rxjs/Observable";
import { createAction } from "redux-actions";

import { ChitChatFactory } from "../../chats/";
import { BackendFactory } from "../../chats/BackendFactory";

const CALLING_REQUEST = "CALLING_REQUEST";
export const CALLING_SUCCESS = "CALLING_SUCCESS";
export const CALLING_FAILURE = "CALLING_FAILURE";
const CALLING_CANCELLED = "CALLING_CANCELLED";

const CallingRequest = createAction(CALLING_REQUEST, ({ target_ids, user_id, room_id, calllingType }) => ({ target_ids, user_id, room_id, calllingType }));
const CallingSuccess = createAction(CALLING_SUCCESS, payload => payload);
const CallingFailure = createAction(CALLING_FAILURE, error => error);
export const callling_Epic = (data: { target_ids, user_id, room_id, calllingType: string }) =>
    dispatch => {
        dispatch(CallingRequest(data));

        let chitchatFac = ChitChatFactory.getInstance();
        let backendFactory = BackendFactory.getInstance();
        let server = backendFactory.getServer();
        if (server) {
            let callingApi = server.getCallingAPI();

            let { target_ids, user_id, room_id, calllingType } = data;
            let source = Observable.fromPromise(
                callingApi.calling(chitchatFac.config.Stalk.apiKey, calllingType, target_ids, { user_id, room_id }));
            let obs = source.subscribe(
                x => dispatch(CallingSuccess(x)),
                (err) => dispatch(CallingFailure(err)),
                () => console.log("OnCalling completed"));
        }
        else {
            dispatch(CallingFailure("Stalk server not yet ready."));
        }
    }

const HANGUP_CALL = "HANGUP_CALL";
export const HANGUP_CALL_SUCCESS = "HANGUP_CALL_SUCCESS";
export const HANGUP_CALL_FAILURE = "HANGUP_CALL_FAILURE";
export const hangupCallRequest = createAction(HANGUP_CALL, ({ target_ids, user_id }) => ({ target_ids, user_id }));
const hangupCallSuccess = createAction(HANGUP_CALL_SUCCESS, payload => payload);
const hangupCallFailure = createAction(HANGUP_CALL_FAILURE, error => error);
export const hangupVideoCall_Epic = action$ =>
    action$.ofType(HANGUP_CALL)
        .mergeMap(action => {
            let chitchatFac = ChitChatFactory.getInstance();
            let backendFactory = BackendFactory.getInstance();
            let server = backendFactory.getServer();
            if (!!server) {
                let callingApi = server.getCallingAPI();

                let { target_ids, user_id } = action.payload;
                return Observable.fromPromise(
                    callingApi.calling(chitchatFac.config.Stalk.apiKey, CallingEvents.HangupCall, target_ids, { user_id }));
            }
            else {
                throw new Error("Stalk server not yet ready.");
            }
        })
        .map(response => hangupCallSuccess(response))
        .catch(error => Observable.of(hangupCallFailure(error)));