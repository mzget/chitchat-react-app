import { IConfig, IChitChatApi, IStalkApi } from "./IConfig";

const chitchat_api = (host) => ({
    apiKey: "chitchat1234",
    host: `${host}`,
    api: `${host}/api`,
    auth: `${host}/api/auth`,
    user: `${host}/api/users`,
    team: `${host}/api/team`,
    group: `${host}/api/group`,
    orgChart: `${host}/api/orgChart`,
    chatroom: `${host}/api/chatroom`,
    fileUpload: `${host}/chats/upload`
}) as IChitChatApi;

const stalk_api = (host, port, api) => ({
    chat: `${host}`,
    port: `${port}`,
    api: {
        user: `${api}/api/stalk/user`
    }
}) as IStalkApi;

const baseConfig = {
    Stalk: {},
    api: {},
    appConfig: {
        encryption: false
    }
} as IConfig;

const composeMyconfig = (config: IConfig) => {
    return (chitchat_host) => {
        config.api = chitchat_api(chitchat_host);

        return (stalk_host, stalk_port, api) => {
            config.Stalk = stalk_api(stalk_host, stalk_port, api);
            return config;
        };
    };
};

const api_stalk_master = "git.animation-genius.com";
const api_stalk_dev = "git.animation-genius.com";
const statkPort = "3010";
const api_master = "http://git.animation-genius.com:9000";
const api_dev = "http://localhost:9000";
const getConfig = () => {
    if (process.env.NODE_ENV === `development`) {
        return composeMyconfig(baseConfig)(api_dev)(api_stalk_master, statkPort, api_dev);
    }
    else if (process.env.NODE_ENV === `production`) {
        return composeMyconfig(baseConfig)(api_master)(api_stalk_master, statkPort, api_master);
    }
};

const config = getConfig();
export default config;
