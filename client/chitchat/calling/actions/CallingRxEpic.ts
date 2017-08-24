import { CallingEvents } from "stalk-js";
import { Observable } from "rxjs/Rx";
import { createAction } from "redux-actions";

import { ChitChatFactory } from "../../chats/";
import { BackendFactory } from "../../chats/BackendFactory";

const VIDEO_CALL_REQUEST = "VIDEO_CALL_REQUEST";
export const VIDEO_CALL_SUCCESS = "VIDEO_CALL_SUCCESS";
export const VIDEO_CALL_FAILURE = "VIDEO_CALL_FAILURE";
const VIDEO_CALL_CANCELLED = "VIDEO_CALL_CANCELLED";
const videoCallRequest = createAction(VIDEO_CALL_REQUEST, ({ target_ids, user_id, room_id }) => ({ target_ids, user_id, room_id }));
const videoCallSuccess = createAction(VIDEO_CALL_SUCCESS, payload => payload);
const videoCallFailure = createAction(VIDEO_CALL_FAILURE, error => error);
export const videoCall_Epic = (data: { target_ids, user_id, room_id }) =>
    dispatch => {
        dispatch(videoCallRequest(data));

        let chitchatFac = ChitChatFactory.getInstance();
        let backendFactory = BackendFactory.getInstance();
        let callingApi = backendFactory.getServer().getCallingAPI();

        let { target_ids, user_id, room_id } = data;
        let source = Observable.fromPromise(
            callingApi.calling(chitchatFac.config.Stalk.apiKey, CallingEvents.VideoCall, target_ids, { user_id, room_id }));
        let obs = source.subscribe(
            x => dispatch(videoCallSuccess(x)),
            (err) => dispatch(videoCallFailure(err)),
            () => console.log("completed"));
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
            let callingApi = backendFactory.getServer().getCallingAPI();

            let { target_ids, user_id } = action.payload;
            return Observable.fromPromise(
                callingApi.calling(chitchatFac.config.Stalk.apiKey, CallingEvents.HangupCall, target_ids, { user_id }));
        })
        .map(response => hangupCallSuccess(response))
        .catch(error => Observable.of(hangupCallFailure(error)));