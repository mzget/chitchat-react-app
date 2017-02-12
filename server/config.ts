interface IConfig {
    chatDB: string;
    redis_port: number;
    redis_host: string;
    token: { secret: string, expire: string };
    apikey: string;
};

const dev: IConfig = {
    chatDB: "mongodb://rfl_dev:rfl1234@git.animation-genius.com:27017/chitchat-dev",
    redis_port: 6379,
    redis_host: "localhost",
    token: {
        secret: "chitchat1234",
        expire: "1 days"
    },
    apikey: "chitchat1234"
};

const master: IConfig = {
    chatDB: "mongodb://rfl_dev:rfl1234@git.animation-genius.com:27017/chitchat-dev",
    redis_port: 6379,
    redis_host: "smelink.animation-genius.com",
    token: {
        secret: "chitchat1234",
        expire: "1 days"
    },
    apikey: "chitchat1234"
};

function getConfig(): IConfig {
    let conf = (process.env.NODE_ENV === `production`) ? master : dev;

    return conf;
}
export const Config = getConfig();

export const DbClient = {
    chitchatUserColl: "users",
    chatroomColl: "rooms",
    stalkUserColl: "chatUsers",
    messageColl: "messages",
    teamsColl: "teams",
    teamProfileCollection: "teamProfiles",
    orgChartCollection: "orgCharts"
};

export const Paths = {
    fileUpload: `./public/uploads/`
};