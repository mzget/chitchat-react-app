"use strict";
const dev = {
    chatDB: "mongodb://rfl_dev:rfl1234@git.animation-genius.com:27017/chitchat-dev",
    redis_port: 6379,
    redis_host: "smelink.animation-genius.com",
    token: {
        secret: "chitchat1234",
        expire: "1 days"
    },
    apikey: "chitchat1234"
};
const production = {
    chatDB: "mongodb://rfl_dev:rfl1234@git.animation-genius.com:27017/chitchat-dev",
    redis_port: 6379,
    redis_host: "smelink.animation-genius.com",
    token: {
        secret: "chitchat1234",
        expire: "1 days"
    },
    apikey: "chitchat1234"
};
function getConfig() {
    let conf = (process.env.NODE_ENV === `production`) ? production : dev;
    return conf;
}
exports.getConfig = getConfig;
exports.DbClient = {
    systemUsersColl: "users",
    chatroomColl: "rooms",
    chatUserColl: "chatUsers",
    messageColl: "messages",
    teamsColl: "teams"
};
exports.Paths = {
    fileUpload: `./public/uploads/`
};
