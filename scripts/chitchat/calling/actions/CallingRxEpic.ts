import { CallingEvents } from "stalk-js/stalkjs";
import { BackendFactory } from "stalk-js/starter";
import { Observable } from "rxjs/Observable";
import { createAction } from "redux-actions";

import InternalStore from "stalk-simplechat";

const CALLING_REQUEST = "CALLING_REQUEST";
export const CALLING_SUCCESS = "CALLING_SUCCESS";
export const CALLING_FAILURE = "CALLING_FAILURE";
const CALLING_CANCELLED = "CALLING_CANCELLED";

const CallingRequest = createAction(CALLING_REQUEST, ({ target_ids, user_id, room_id, calllingType }) => ({ target_ids, user_id, room_id, calllingType }));
const CallingSuccess = createAction(CALLING_SUCCESS, (payload) => payload);
const CallingFailure = createAction(CALLING_FAILURE, (error) => error);
export const callling_Epic = (data: { target_ids, user_id, room_id, calllingType: string }) =>
    (dispatch) => {
        dispatch(CallingRequest(data));

        const backendFactory = BackendFactory.getInstance();
        const server = backendFactory.getServer();
        if (server) {
            const callingApi = server.getCallingAPI();

            const { target_ids, user_id, room_id, calllingType } = data;
            const source = Observable.fromPromise(
                callingApi.calling(InternalStore.config.apiKey, calllingType, target_ids, { user_id, room_id }));
            const obs = source.subscribe(
                (x) => dispatch(CallingSuccess(x)),
                (err) => dispatch(CallingFailure(err)),
                () => console.log("OnCalling completed"));
        } else {
            dispatch(CallingFailure("Stalk server not yet ready."));
        }
    };

const HANGUP_CALL = "HANGUP_CALL";
export const HANGUP_CALL_SUCCESS = "HANGUP_CALL_SUCCESS";
export const HANGUP_CALL_FAILURE = "HANGUP_CALL_FAILURE";
export const hangupCallRequest = createAction(HANGUP_CALL, ({ target_ids, user_id }) => ({ target_ids, user_id }));
const hangupCallSuccess = createAction(HANGUP_CALL_SUCCESS, (payload) => payload);
const hangupCallFailure = createAction(HANGUP_CALL_FAILURE, (error) => error);
export const hangupVideoCall_Epic = (action$) =>
    action$.ofType(HANGUP_CALL)
        .mergeMap((action) => {
            const backendFactory = BackendFactory.getInstance();
            const server = backendFactory.getServer();
            if (!!server) {
                const callingApi = server.getCallingAPI();

                const { target_ids, user_id } = action.payload;
                return Observable.fromPromise(
                    callingApi.calling(InternalStore.config.apiKey, CallingEvents.HangupCall, target_ids, { user_id }));
            } else {
                throw new Error("Stalk server not yet ready.");
            }
        })
        .map((response) => hangupCallSuccess(response))
        .catch((error) => Observable.of(hangupCallFailure(error)));
