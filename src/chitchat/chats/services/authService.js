import InternalStore from "stalk-simplechat";
import { withToken, chitchat_headers } from "../utils/chitchatServiceUtils";
const getConfig = () => InternalStore.apiConfig;
export function auth(user) {
    return fetch(`${getConfig().auth}`, {
        method: "POST",
        body: JSON.stringify({ email: user.email, password: user.password }),
        headers: chitchat_headers(),
    });
}
export function authWithSocial(user) {
    return fetch(`${getConfig().auth}/social`, {
        method: "POST",
        body: JSON.stringify({
            email: user.email,
            social_type: user.social_type,
        }),
        headers: chitchat_headers(),
    });
}
export function tokenAuth(token) {
    return fetch(`${getConfig().auth}/verify`, {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: chitchat_headers(),
    });
}
export function logout(token) {
    return fetch(`${getConfig().auth}/logout`, {
        method: "POST",
        headers: withToken(chitchat_headers())(token),
    });
}
export function signup(user) {
    return fetch(`${getConfig().user}/signup`, {
        method: "POST",
        headers: chitchat_headers(),
        body: JSON.stringify({ user }),
    });
}
