type Config = {
    chatDB: string;
    redis_port: number;
    redis_host: string;
    token: { secret: string, expire: string }
    apikey: string;
}

const dev: Config = {
    chatDB: "mongodb://rfl_dev:rfl1234@git.animation-genius.com:27017/chitchat-dev",
    redis_port: 6379,
    redis_host: "smelink.animation-genius.com",
    token: {
        secret: 'chitchat1234',
        expire: "1 days"
    },
    apikey: 'chitchat1234'
}

const production: Config = {
    chatDB: "mongodb://rfl_dev:rfl1234@git.animation-genius.com:27017/chitchat-dev",
    redis_port: 6379,
    redis_host: "smelink.animation-genius.com",
    token: {
        secret: 'chitchat1234',
        expire: "1 days"
    },
    apikey: 'chitchat1234'
}

export function getConfig(): Config {
    let conf = (process.env.NODE_ENV === `production`) ? production : dev;

    return conf;
}

export const DbClient = {
    systemUsersColl: "users",
    chatroomColl: "rooms",
    chatUserColl: "chatUsers",
    messageColl: "messages",
    teamsColl: "teams"
}

export const Paths = {
    fileUpload: `./public/uploads/`
}