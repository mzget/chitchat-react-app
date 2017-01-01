type Config = {
    appDB: string,
    backendDB: string,
    chatDB: string;
    redis_port: number;
    redis_host: string;
}

const dev: Config = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink",
    backendDB: "mongodb://git.animation-genius.com:27017/smelink-yii",
    chatDB: "mongodb://git.animation-genius.com:27017/smelink-chat",
    redis_port: 6379,
    redis_host: "http://smelink.animation-genius.com"
}

const master: Config = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink-master",
    backendDB: "mongodb://git.animation-genius.com:27017/smelink-yii",
    chatDB: "mongodb://git.animation-genius.com:27017/smelink-chat",
    redis_port: 6379,
    redis_host: "http://smelink.animation-genius.com"
}

const production: Config = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink-master",
    backendDB: "mongodb://git.animation-genius.com:27017/smelink-yii",
    chatDB: "mongodb://git.animation-genius.com:27017/smelink-chat",
    redis_port: 6379,
    redis_host: "http://smelink.animation-genius.com"
}

export function getConfig(): Config {
    let conf = (process.env.NODE_ENV === `production`) ? production : dev;

    return conf;
}

export const DbClient = {
    user: "user",
    userContactColl: "users",
    chatroomCall: "rooms",
    chatUserCall: "users",
    messageColl: "messages"
}