import { ChitChatFactory } from "./chitchat/chats/ChitChatFactory";
export const chitchatFactory = ChitChatFactory.createInstance();
const api_stalk = "wss://chitchats.ga";
const stalkPort = 3050;
const stalkKey = "chitchat1234";
const chitchat_api = "https://chitchats.ga";
export const chitchat_graphql = "https://chitchats.ga/graphql";
export const signalingServer = "https://chitchats.ga:8888";
export const config = {
    Stalk: {
        apiKey: stalkKey,
        chat: `${api_stalk}`,
        port: stalkPort
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
        message: `${chitchat_api}/api/stalk/message`,
        stalk_user: `${chitchat_api}/api/stalk/user`,
        fileUpload: `${chitchat_api}/chats/upload`
    },
    appConfig: {
        encryption: true,
        secret: "chitchat#1234"
    }
};
