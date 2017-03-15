import redis = require("redis");
import bluebird = require("bluebird");
import { Config } from "../../config";

const RedisClient = redis.createClient(Config.redis_port, Config.redis_host, { no_ready_check: true });
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
// bluebird.promisifyAll(redis.Multi.prototype);

export default RedisClient;

export const ROOM_KEY = "rooms";
export const ROOM_MAP_KEY = "room_map";