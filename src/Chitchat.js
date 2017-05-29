"use strict";
var ChitchatFactory_1 = require("./chitchat/chats/ChitchatFactory");
exports.chitchatFactory = ChitchatFactory_1.ChitChatFactory.createInstance();
var api_stalk = "203.150.95.146";
var stalkPort = 3050;
var stalkKey = "chitchat1234";
var chitchat_api = "http://203.150.95.146:9000"; //"http://localhost:9000"; "http://git.animation-genius.com:9000"
var config = {
    Stalk: {
        apiKey: stalkKey,
        chat: "" + api_stalk,
        port: stalkPort,
        api: {
            user: chitchat_api + "/api/stalk/user"
        }
    },
    api: {
        apiKey: "chitchat1234",
        host: "" + chitchat_api,
        api: chitchat_api + "/api",
        auth: chitchat_api + "/api/auth",
        user: chitchat_api + "/api/users",
        team: chitchat_api + "/api/team",
        group: chitchat_api + "/api/group",
        orgChart: chitchat_api + "/api/orgChart",
        chatroom: chitchat_api + "/api/chatroom",
        fileUpload: chitchat_api + "/chats/upload"
    },
    appConfig: {
        encryption: false
    }
};
exports.chitchatFactory.initConfig(config);
