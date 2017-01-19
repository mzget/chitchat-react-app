type Config = {
    appDB: string,
    systemDB: string,
    chatDB: string;
    redis_port: number;
    redis_host: string;
}

const dev: Config = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink",
    systemDB: "mongodb://rfl_dev:rfl1234@git.animation-genius.com:27017/smelink-yii",
    chatDB: "mongodb://rfl_dev:rfl1234@git.animation-genius.com:27017/chitchat-dev",
    redis_port: 6379,
    redis_host: "smelink.animation-genius.com"
}

const master: Config = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink-master",
    systemDB: "mongodb://git.animation-genius.com:27017/smelink-yii",
    chatDB: "mongodb://git.animation-genius.com:27017/smelink-chat",
    redis_port: 6379,
    redis_host: "smelink.animation-genius.com"
}

const production: Config = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink-master",
    systemDB: "mongodb://git.animation-genius.com:27017/smelink-yii",
    chatDB: "mongodb://rfl_dev:rfl1234@git.animation-genius.com:27017/chitchat-dev",
    redis_port: 6379,
    redis_host: "smelink.animation-genius.com"
}

export function getConfig(): Config {
    let conf = (process.env.NODE_ENV === `production`) ? production : dev;

    return conf;
}

export const DbClient = {
    systemUsersColl: "users",
    userContactColl: "users",
    chatroomCall: "rooms",
    chatUserCall: "users",
    messageColl: "messages"
}

export const Paths = {
    fileUpload: `./public/uploads/`
}