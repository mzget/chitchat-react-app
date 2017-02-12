"use strict";
const redis = require("redis");
const config_1 = require("../../config");
const RedisClient = redis.createClient(config_1.Config.redis_port, config_1.Config.redis_host);
RedisClient.on("connect", function () {
    console.log("redis connected");
});
RedisClient.on("error", function (err) {
    console.error("redis Error " + err);
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RedisClient;
exports.ROOM_KEY = "rooms";
exports.ROOM_MAP_KEY = "room_map";
