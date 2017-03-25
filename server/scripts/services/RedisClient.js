"use strict";
const redis = require("redis");
const bluebird = require("bluebird");
const config_1 = require("../../config");
const RedisClient = redis.createClient(config_1.Config.redis_port, config_1.Config.redis_host, { no_ready_check: true });
RedisClient.on("connect", function () {
    console.log("redis connected");
});
RedisClient.on("ready", function () {
    console.log("redis ready ");
});
RedisClient.on("error", function (err) {
    console.error("redis Error " + err);
});
bluebird.promisifyAll(RedisClient);
Object.defineProperty(exports, "__esModule", { value: true });
// bluebird.promisifyAll(redis.Multi.prototype);
exports.default = RedisClient;
exports.ROOM_KEY = "rooms";
exports.ROOM_MAP_KEY = "room_map";
