import { IApiConfig, IStalkConfig } from "stalk-js/starter";

const apiStalk = "wss://chitchats.ga"; // "wss://chitchats.ga";
const stalkPort = 3020; // 3010
const stalkKey = "chitchat1234";

const apiChitchat = "https://chitchats.ga:9000"; // "http://localhost:9000"; "https://chitchats.ga"
export const chitchatGraphql = "https://chitchats.ga:9000/graphql"; // "http://localhost:9000/graphql" : "https://chitchats.ga/graphql";
export const signalingServer = "https://chitchats.ga:8888";

export const config = {
    Stalk: {
        apiKey: stalkKey,
        chat: `${apiStalk}`,
        port: stalkPort,
        apiVersion: "0.2",
        appId: "chitchat",
    } as IStalkConfig,
    api: {
        apiKey: "chitchat1234",
        host: `${apiChitchat}`,
        api: `${apiChitchat}/api`,
        auth: `${apiChitchat}/api/auth`,
        user: `${apiChitchat}/api/users`,
        team: `${apiChitchat}/api/team`,
        group: `${apiChitchat}/api/group`,
        orgChart: `${apiChitchat}/api/orgChart`,
        chatroom: `${apiChitchat}/api/chatroom`,
        message: `${apiChitchat}/api/stalk/message`,
        stalk_user: `${apiChitchat}/api/stalk/user`,
        fileUpload: `${apiChitchat}/chats/upload`,
    } as IApiConfig,
    appConfig: {
        encryption: true,
        secret: "chitchat#1234",
    },
};
