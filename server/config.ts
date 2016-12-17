type Config = {
    appDB: string
}

const dev: Config = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink-yii"
}

const master: Config = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink-master"
}

const production: Config = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink-master"
}

export function getConfig(): Config {
    let conf = (process.env.NODE_ENV === `production`) ? production : dev;

    return conf;
}

export const DbClient = {
    user: "user"
}