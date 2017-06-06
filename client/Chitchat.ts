import { ChitChatFactory } from "./chitchat/chats/ChitchatFactory";
import { IConfig } from "./chitchat/chats/iConfig";
export const chitchatFactory = ChitChatFactory.createInstance();

const api_stalk = "wss://203.150.95.146";
const stalkPort = 3050;
const stalkKey = "chitchat1234";
const chitchat_api = "https://chitchats.ga"; //"http://localhost:9000"; "http://git.animation-genius.com:9000"

const config = {
    Stalk: {
        apiKey: stalkKey,
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
} as IConfig;
chitchatFactory.initConfig(config);
