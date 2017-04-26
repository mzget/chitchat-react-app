const api_stalk = "localhost";
const stalkPort = 3010;
const chitchat_api = "http://localhost:9000"; //"http://localhost:9000"; "http://git.animation-genius.com:9000"

import { ChitChatFactory } from "./chitchat/chats/chitchatFactory";
import { IConfig } from "./chitchat/chats/iConfig";
export const chitchatFactory = ChitChatFactory.createInstance();
const config = {
    Stalk: {
        chat: `${api_stalk}`,
        port: stalkPort,
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
chitchatFactory.initConfig(config);