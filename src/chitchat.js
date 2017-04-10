"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_stalk = "git.animation-genius.com";
const stalkPort = "3010";
const chitchat_api = "http://localhost:9000"; //"http://git.animation-genius.com:9000";
const chitchatFactory_1 = require("./chitchat/chats/chitchatFactory");
exports.chitchatFactory = chitchatFactory_1.ChitChatFactory.createInstance();
const config = {
    Stalk: {
        chat: `${api_stalk}`,
        port: `${stalkPort}`,
        api: {
            user: `${chitchat_api}/api/stalk/user`
        }
    },
    api: {
        apiKey: "chitchat1234",
        host: `${chitchat_api}`,
        api: `${chitchat_api}/api`,
        auth: `${chitchat_api}/api/auth`,
        user: `${chitchat_api}/api/users`,
        team: `${chitchat_api}/api/team`,
        group: `${chitchat_api}/api/group`,
        orgChart: `${chitchat_api}/api/orgChart`,
        chatroom: `${chitchat_api}/api/chatroom`,
        fileUpload: `${chitchat_api}/chats/upload`
    },
    appConfig: {
        encryption: false
    }
};
exports.chitchatFactory.initConfig(config);
