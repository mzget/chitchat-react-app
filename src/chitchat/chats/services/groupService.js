import * as Rx from "rxjs";
const { ajax } = Rx.Observable;
import InternalStore, { withToken, apiHeaders, } from "stalk-simplechat";
const getConfig = () => InternalStore.apiConfig;
const authReducer = () => InternalStore.authStore;
export function addMember(roomId, member) {
    return ajax({
        method: "POST",
        url: `${getConfig().group}/addMember/${roomId}`,
        body: JSON.stringify({ member }),
        headers: apiHeaders(),
    });
}
export function removeMember(roomId, memberId) {
    return ajax({
        method: "POST",
        url: `${getConfig().group}/removeMember/${roomId}`,
        body: JSON.stringify({ member_id: memberId }),
        headers: withToken(apiHeaders())(authReducer().api_token),
    });
}
