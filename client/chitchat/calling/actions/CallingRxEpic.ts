import { CallingEvents } from "stalk-js";
import { Observable } from "rxjs/Rx";
import { ajax } from "rxjs/observable/dom/ajax";
import { createAction } from "redux-actions";

import { ChitChatFactory } from "../../chats/";
import { BackendFactory } from "../../chats/BackendFactory";

const VIDEO_CALL_REQUEST = "VIDEO_CALL_REQUEST";
export const VIDEO_CALL_SUCCESS = "VIDEO_CALL_SUCCESS";
export const VIDEO_CALL_FAILURE = "VIDEO_CALL_FAILURE";
const VIDEO_CALL_CANCELLED = "VIDEO_CALL_CANCELLED";
export const videoCallRequest = createAction(VIDEO_CALL_REQUEST, ({ target_ids, user_id, room_id }) => ({ target_ids, user_id, room_id }));
const videoCallSuccess = createAction(VIDEO_CALL_SUCCESS, payload => payload);
const videoCallFailure = createAction(VIDEO_CALL_FAILURE, error => error);
export const videoCall_Epic = action$ =>
    action$.ofType(VIDEO_CALL_REQUEST)
        .mergeMap(action => {
            let chitchatFac = ChitChatFactory.getInstance();
            let backendFactory = BackendFactory.getInstance();
            let callingApi = backendFactory.getServer().getCallingAPI();

            let { target_ids, user_id, room_id } = action.payload;
            return Observable.fromPromise(
                callingApi.callingRequest(target_ids, CallingEvents.VideoCall, chitchatFac.config.Stalk.apiKey, { user_id, room_id }));
        })
        .map(response => videoCallSuccess(response))
        .catch(error => Observable.of(videoCallFailure(error)))
        .takeUntil(action$.ofType(VIDEO_CALL_CANCELLED));