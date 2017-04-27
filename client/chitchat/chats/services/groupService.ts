import * as Rx from "rxjs";
const { ajax } = Rx.Observable;

import { ChitChatFactory } from "../chitchatFactory";
import { chitchat_headers, withToken } from "../utils/chitchatServiceUtils";
const getConfig = () => ChitChatFactory.getInstance().config;
const authReducer = () => ChitChatFactory.getInstance().authStore;

export function addMember(room_id: string, member: any) {
    return ajax({
        method: "POST",
        url: `${getConfig().api.group}/addMember/${room_id}`,
        body: JSON.stringify({ member: member }),
        headers: chitchat_headers()
    });
}