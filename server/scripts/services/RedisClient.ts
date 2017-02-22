import redis = require("redis");
import { Config } from "../../config";

export enum RedisStatus {
    error = 0, connected = 1, ready = 2
}

export let redisStatus: RedisStatus = RedisStatus.error;
const RedisClient = redis.createClient(Config.redis_port, Config.redis_host);
RedisClient.on("connect", function () {
    console.log("redis connected");
    redisStatus = RedisStatus.connected;
});
RedisClient.on("ready", function () {
    console.log("redis ready ");
    redisStatus = RedisStatus.ready;
});
RedisClient.on("error", function (err) {
    console.error("redis Error " + err);
    redisStatus = RedisStatus.error;
});

export default RedisClient;

export const ROOM_KEY = "rooms";
export const ROOM_MAP_KEY = "room_map";