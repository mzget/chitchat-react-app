"use strict";
var chitchat_api = function (host) { return ({
    apiKey: "chitchat1234",
    host: "" + host,
    api: host + "/api",
    auth: host + "/api/auth",
    user: host + "/api/users",
    team: host + "/api/team",
    group: host + "/api/group",
    orgChart: host + "/api/orgChart",
    chatroom: host + "/api/chatroom",
    fileUpload: host + "/chats/upload"
}); };
var stalk_api = function (host, port, api) { return ({
    chat: "" + host,
    port: "" + port,
    api: {
        user: api + "/api/stalk/user"
    }
}); };
var baseConfig = {
    Stalk: {},
    api: {},
    appConfig: {
        encryption: false
    }
};
var composeMyconfig = function (config) {
    return function (chitchat_host) {
        config.api = chitchat_api(chitchat_host);
        return function (stalk_host, stalk_port, api) {
            config.Stalk = stalk_api(stalk_host, stalk_port, api);
            return config;
        };
    };
};
var api_stalk_master = "git.animation-genius.com";
var api_stalk_dev = "git.animation-genius.com";
var stalkPort = "3010";
var api_master = "http://git.animation-genius.com:9000";
var api_dev = "http://localhost:9000";
var getConfig = function () {
    if (process.env.NODE_ENV === "development") {
        return composeMyconfig(baseConfig)(api_dev)(api_stalk_master, stalkPort, api_dev);
    }
    else if (process.env.NODE_ENV === "production") {
        return composeMyconfig(baseConfig)(api_master)(api_stalk_master, stalkPort, api_master);
    }
};
exports.config = getConfig();
