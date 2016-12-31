"use strict";
const redis = require("redis");
const config = require("../../config");
const getConfig = config.getConfig();
const client = redis.createClient(getConfig.redis_port, getConfig.redis_host);
client.on('connect', function () {
    console.log('redis connected');
});
client.on("error", function (err) {
    console.log("redis Error " + err);
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = client;
