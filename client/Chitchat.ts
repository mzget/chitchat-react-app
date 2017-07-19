import { ChitChatFactory } from "./chitchat/chats/ChitChatFactory";
import { IConfig, IChitChatApi, IStalkApi } from "./chitchat/chats/iConfig";
export const chitchatFactory = ChitChatFactory.createInstance();

const api_stalk = "wss://chitchats.ga"; //"wss://chitchats.ga";
const stalkPort = 3050;
const stalkKey = "chitchat1234";
const chitchat_api = "https://chitchats.ga"; //"http://localhost:9000"; "https://chitchats.ga"
export const chitchat_graphql = "https://chitchats.ga/graphql"; // "http://localhost:9000/graphql" : "https://chitchats.ga/graphql";
export const signalingServer = "http://chitchats.ga:8888";

export const config = {
    Stalk: {
        apiKey: stalkKey,
        chat: `${api_stalk}`,
        port: stalkPort
    } as IStalkApi,
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
    } as IChitChatApi,
    appConfig: {
        encryption: true,
        secret: "chitchat#1234"
    }
} as IConfig;
