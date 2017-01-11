import redis = require('redis');
import config = require("../../config");
const getConfig = config.getConfig();

const redisClient = redis.createClient(getConfig.redis_port, getConfig.redis_host);
redisClient.on('connect', function () {
    console.log('redis connected');
});
redisClient.on("error", function (err) {
    console.log("redis Error " + err);
});

export default redisClient;

export const ROOM_KEY = "rooms";
export const ROOM_MAP_KEY = "room_map";