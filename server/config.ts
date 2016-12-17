type Config = {
    appDB: string,
    backendDB: string,
    chatDB: string;
}

const dev: Config = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink",
    backendDB: "mongodb://git.animation-genius.com:27017/smelink-yii",
    chatDB: "mongodb://git.animation-genius.com:27017/smelink-chat"
}

const master: Config = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink-master",
    backendDB: "mongodb://git.animation-genius.com:27017/smelink-yii",
    chatDB: "mongodb://git.animation-genius.com:27017/smelink-chat"
}

const production: Config = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink-master",
    backendDB: "mongodb://git.animation-genius.com:27017/smelink-yii",
    chatDB: "mongodb://git.animation-genius.com:27017/smelink-chat"
}

export function getConfig(): Config {
    let conf = (process.env.NODE_ENV === `production`) ? production : dev;

    return conf;
}

export const DbClient = {
    user: "user",
    userContactColl: "users",
    chatroomCall: "rooms",
    chatUserCall: "users"
}