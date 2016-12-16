"use strict";
const dev = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink",
    appDB2: "mongodb://smelink:1234@smelink.animation-genius.com:27017/smelink"
};
const master = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink-master",
    appDB2: "mongodb://smelink:1234@smelink.animation-genius.com:27017/smelink"
};
const production = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink-master",
    appDB2: "mongodb://smelink:1234@smelink.animation-genius.com:27017/smelink"
};
function getConfig() {
    let conf = (process.env.NODE_ENV === `production`) ? production : master;
    return conf;
}
exports.getConfig = getConfig;
exports.DbClient = {
    user: "user"
};
