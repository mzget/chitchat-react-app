"use strict";
const redis = require("redis");
const config = require("../../config");
const getConfig = config.getConfig();
const redisClient = redis.createClient(getConfig.redis_port, getConfig.redis_host);
redisClient.on("connect", function () {
    console.log("redis connected");
});
redisClient.on("error", function (err) {
    console.error("redis Error " + err);
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = redisClient;
exports.ROOM_KEY = "rooms";
exports.ROOM_MAP_KEY = "room_map";
