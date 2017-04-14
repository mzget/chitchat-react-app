import "isomorphic-fetch";

import { ChitChatFactory } from "../chitchatFactory";
import { withToken, chitchat_headers } from "../utils/chitchatServiceUtils";

const getConfig = () => ChitChatFactory.getInstance().config;

export function auth(user: { email: string, password: string }) {
    return fetch(`${getConfig().api.auth}`, {
        method: "POST",
        body: JSON.stringify({ email: user.email, password: user.password }),
        headers: chitchat_headers()
    });
}

export function tokenAuth(token: string) {
    return fetch(`${getConfig().api.auth}/verify`, {
        method: "POST",
        body: JSON.stringify({ token: token }),
        headers: chitchat_headers()
    });
}