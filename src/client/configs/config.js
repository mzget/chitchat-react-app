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
});
const stalk_api = (host, port, api) => ({
    chat: `${host}`,
    port: `${port}`,
    api: {
        user: `${api}/api/stalk/user`
    }
});
const baseConfig = {
    Stalk: {},
    api: {},
    appConfig: {
        encryption: false
    }
};
const composeMyconfig = (config) => {
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
const stalkPort = "3010";
const api_master = "http://git.animation-genius.com:9000";
const api_dev = "http://localhost:9000";
const getConfig = () => {
    if (process.env.NODE_ENV === `development`) {
        return composeMyconfig(baseConfig)(api_dev)(api_stalk_master, stalkPort, api_dev);
    }
    else if (process.env.NODE_ENV === `production`) {
        return composeMyconfig(baseConfig)(api_master)(api_stalk_master, stalkPort, api_master);
    }
};
export const config = getConfig();
