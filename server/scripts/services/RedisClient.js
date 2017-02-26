"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis = require("redis");
const config_1 = require("../../config");
var RedisStatus;
(function (RedisStatus) {
    RedisStatus[RedisStatus["error"] = 0] = "error";
    RedisStatus[RedisStatus["connected"] = 1] = "connected";
    RedisStatus[RedisStatus["ready"] = 2] = "ready";
})(RedisStatus = exports.RedisStatus || (exports.RedisStatus = {}));
exports.redisStatus = RedisStatus.error;
const RedisClient = redis.createClient(config_1.Config.redis_port, config_1.Config.redis_host);
RedisClient.on("connect", function () {
    console.log("redis connected");
    exports.redisStatus = RedisStatus.connected;
});
RedisClient.on("ready", function () {
    console.log("redis ready ");
    exports.redisStatus = RedisStatus.ready;
});
RedisClient.on("error", function (err) {
    console.error("redis Error " + err);
    exports.redisStatus = RedisStatus.error;
});
exports.default = RedisClient;
exports.ROOM_KEY = "rooms";
exports.ROOM_MAP_KEY = "room_map";
