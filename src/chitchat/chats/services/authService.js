"use strict";
require("isomorphic-fetch");
var chitchatFactory_1 = require("../chitchatFactory");
var chitchatServiceUtils_1 = require("../utils/chitchatServiceUtils");
var getConfig = function () { return chitchatFactory_1.ChitChatFactory.getInstance().config; };
function auth(user) {
    return fetch("" + getConfig().api.auth, {
        method: "POST",
        body: JSON.stringify({ email: user.email, password: user.password }),
        headers: chitchatServiceUtils_1.chitchat_headers()
    });
}
exports.auth = auth;
function tokenAuth(token) {
    return fetch(getConfig().api.auth + "/verify", {
        method: "POST",
        body: JSON.stringify({ token: token }),
        headers: chitchatServiceUtils_1.chitchat_headers()
    });
}
exports.tokenAuth = tokenAuth;
function logout(token) {
    return fetch(getConfig().api.auth + "/logout", {
        method: "POST",
        headers: chitchatServiceUtils_1.withToken(chitchatServiceUtils_1.chitchat_headers())(token)
    });
}
exports.logout = logout;
function signup(user) {
    return fetch(getConfig().api.user + "/signup", {
        method: "POST",
        headers: chitchatServiceUtils_1.chitchat_headers(),
        body: JSON.stringify({ user: user })
    });
}
exports.signup = signup;
