"use strict";
const dev = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink",
    backendDB: "mongodb://git.animation-genius.com:27017/smelink-yii",
    chatDB: "mongodb://git.animation-genius.com:27017/smelink-chat",
    REDIS_PORT: 6000
};
const master = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink-master",
    backendDB: "mongodb://git.animation-genius.com:27017/smelink-yii",
    chatDB: "mongodb://git.animation-genius.com:27017/smelink-chat",
    REDIS_PORT: 6000
};
const production = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink-master",
    backendDB: "mongodb://git.animation-genius.com:27017/smelink-yii",
    chatDB: "mongodb://git.animation-genius.com:27017/smelink-chat",
    REDIS_PORT: 6000
};
function getConfig() {
    let conf = (process.env.NODE_ENV === `production`) ? production : dev;
    return conf;
}
exports.getConfig = getConfig;
exports.DbClient = {
    user: "user",
    userContactColl: "users",
    chatroomCall: "rooms",
    chatUserCall: "users"
};
