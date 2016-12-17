"use strict";
const dev = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink-yii"
};
const master = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink-master"
};
const production = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink-master"
};
function getConfig() {
    let conf = (process.env.NODE_ENV === `production`) ? production : dev;
    return conf;
}
exports.getConfig = getConfig;
exports.DbClient = {
    user: "user"
};
