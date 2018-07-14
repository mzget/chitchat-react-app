import * as Rx from "rxjs";
import InternalStore, { withToken, apiHeaders, } from "stalk-simplechat";
const getConfig = () => InternalStore.apiConfig;
const authReducer = () => InternalStore.authStore;
const { ajax } = Rx.Observable;
export function updateMessageReader(messageId, roomId) {
    return fetch(`${getConfig().message}/updateReader`, {
        method: "POST",
        headers: withToken(apiHeaders())(authReducer().api_token),
        body: JSON.stringify({
            room_id: roomId,
            message_id: messageId,
        }),
    });
}
export function updateMessagesReader(messagesId, roomId) {
    return fetch(`${getConfig().message}/updateMessagesReader`, {
        method: "POST",
        headers: withToken(apiHeaders())(authReducer().api_token),
        body: JSON.stringify({
            room_id: roomId,
            messages: messagesId,
        }),
    });
}
