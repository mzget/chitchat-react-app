import config from "../../configs/config";
import { Record } from "immutable";
import { createAction } from 'redux-actions';
const Rx = require('rxjs/Rx');
const { ajax } = Rx.Observable;
const FETCH_PRIVATE_CHATROOM = "FETCH_PRIVATE_CHATROOM";
const FETCH_PRIVATE_CHATROOM_FAILURE = "FETCH_PRIVATE_CHATROOM_FAILURE";
export const FETCH_PRIVATE_CHATROOM_SUCCESS = "FETCH_PRIVATE_CHATROOM_SUCCESS";
const FETCH_PRIVATE_CHATROOM_CANCELLED = "FETCH_PRIVATE_CHATROOM_CANCELLED";
export const fetchPrivateChatRoom = createAction(FETCH_PRIVATE_CHATROOM, (ownerId, roommateId) => ({ ownerId, roommateId }));
const fetchPrivateChatRoomSuccess = (payload) => ({ type: FETCH_PRIVATE_CHATROOM_SUCCESS, payload });
const cancelFetchPrivateChatRoom = () => ({ type: FETCH_PRIVATE_CHATROOM_CANCELLED });
const fetchPrivateChatRoomFailure = payload => ({ type: FETCH_PRIVATE_CHATROOM_FAILURE, payload, error: true });
export const getPrivateChatRoomEpic = action$ => {
    return action$.ofType(FETCH_PRIVATE_CHATROOM)
        .mergeMap(action => ajax.post(`${config.api.chatroom}/`, action.payload))
        .map(json => fetchPrivateChatRoomSuccess(json.response))
        .takeUntil(action$.ofType(FETCH_PRIVATE_CHATROOM_CANCELLED))
        .catch(error => Rx.Observable.of(fetchPrivateChatRoomFailure(error.xhr.response)));
};
export const ChatRoomInitState = Record({
    isFetching: false,
    state: null,
    room: null
});
export const chatroomReducer = (state = new ChatRoomInitState(), action) => {
    switch (action.type) {
        case FETCH_PRIVATE_CHATROOM_SUCCESS:
            return state.set("room", action.payload.result[0])
                .set("state", FETCH_PRIVATE_CHATROOM_SUCCESS);
        case FETCH_PRIVATE_CHATROOM_CANCELLED:
            return state;
        case FETCH_PRIVATE_CHATROOM_FAILURE:
            return state;
        default:
            return state;
    }
};
