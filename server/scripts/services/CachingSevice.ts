import redis = require("redis");
import { Config } from "../../config";

const redisClient = redis.createClient(Config.redis_port, Config.redis_host);
redisClient.on("connect", function () {
    console.log("redis connected");
});
redisClient.on("error", function (err) {
    console.error("redis Error " + err);
});

export default redisClient;

export const ROOM_KEY = "rooms";
export const ROOM_MAP_KEY = "room_map";