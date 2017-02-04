const api_master = "http://git.animation-genius.com:9000";
const api_dev = "http://localhost:9000";



type IApi = {
    apiKey: string;
    host: string;
    api: string;
    auth: string;
    user: string;
    team: string;
    group: string;
    orgChart: string;
    chatroom: string;
    fileUpload: string;
};
type IConfigFile = {
    Stalk: {
        chat: string,
        port: string,
        api: {
            user: string;
        },
    };
    appConfig: {
        encryption: boolean
    };
    api: IApi;
};

const rest_api = (host) => ({
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
}) as IApi;

const devConfig = {
    Stalk: {
        chat: "localhost",
        port: "3010",
        api: {
            user: "http://localhost:9000/api/stalk/user"
        }
    },
    appConfig: {
        encryption: true
    },
    api: {

    }
} as IConfigFile;

const masterConfig = {
    Stalk: {
        chat: "git.animation-genius.com",
        port: "3010",
        api: {
            user: "http://git.animation-genius.com:9000/api/stalk/user"
        }
    },
    appConfig: {
        encryption: false
    },
    api: {

    }
} as IConfigFile;

const composeMyconfig = (config: IConfigFile) => {
    return (host) => {
        config.api = rest_api(host);
        return config;
    };
};

const getConfig = () => {
    if (process.env.NODE_ENV === `development`) {
        return composeMyconfig(devConfig)(api_dev);
    }
    else if (process.env.NODE_ENV === `production`) {
        return composeMyconfig(masterConfig)(api_master);
    }
};

const config = getConfig();
export default config;
