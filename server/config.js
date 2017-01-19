"use strict";
const dev = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink",
    systemDB: "mongodb://rfl_dev:rfl1234@git.animation-genius.com:27017/smelink-yii",
    chatDB: "mongodb://rfl_dev:rfl1234@git.animation-genius.com:27017/chitchat-dev",
    redis_port: 6379,
    redis_host: "smelink.animation-genius.com",
    token: {
        secret: 'chitchat1234',
        expire: "1 days"
    }
};
const production = {
    appDB: "mongodb://git.animation-genius.com:27017/smelink-master",
    systemDB: "mongodb://git.animation-genius.com:27017/smelink-yii",
    chatDB: "mongodb://rfl_dev:rfl1234@git.animation-genius.com:27017/chitchat-dev",
    redis_port: 6379,
    redis_host: "smelink.animation-genius.com",
    token: {
        secret: 'chitchat1234',
        expire: "1 days"
    }
};
function getConfig() {
    let conf = (process.env.NODE_ENV === `production`) ? production : dev;
    return conf;
}
exports.getConfig = getConfig;
exports.DbClient = {
    systemUsersColl: "users",
    userContactColl: "users",
    chatroomCall: "rooms",
    chatUserCall: "users",
    messageColl: "messages"
};
exports.Paths = {
    fileUpload: `./public/uploads/`
};
