type Config = {
    appDB: string,
    appDB2: string
}

const dev: Config = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink",
    appDB2: "mongodb://smelink:1234@smelink.animation-genius.com:27017/smelink"
}

const master: Config = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink-master",
    appDB2: "mongodb://smelink:1234@smelink.animation-genius.com:27017/smelink"
}

const production: Config = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink-master",
    appDB2: "mongodb://smelink:1234@smelink.animation-genius.com:27017/smelink"
}

export function getConfig(): Config {
    let conf = (process.env.NODE_ENV === `production`) ? production : master;

    return conf;
}

export const DbClient = {
    user: "user"
}