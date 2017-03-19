"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb = require("mongodb");
const redis = require("redis");
const RedisClient_1 = require("./RedisClient");
const config_1 = require("../../config");
const DbClient_1 = require("../DbClient");
const { ObjectID } = mongodb;
exports.checkedCanAccessRoom = (roomId, userId, callback) => {
    getRoom(roomId, (err, room) => {
        let result = false;
        if (err || !room) {
            console.error("getRoom fail", err);
            callback(null, result);
        }
        else {
            if (room.members && Array.isArray(room.members)) {
                let members = room.members;
                result = members.some(value => {
                    if (value._id == userId) {
                        return true;
                    }
                });
                callback(null, result);
            }
            else
                callback(null, result);
        }
    });
};
/**
 * roomMembers the dict for keep roomId pair with array of uid who is a member of room.
 */
function setRoomsMap(data, callback) {
    data.forEach(element => {
        let room = JSON.parse(JSON.stringify(element));
        RedisClient_1.default.hset(RedisClient_1.ROOM_MAP_KEY, element._id.toString(), JSON.stringify(room), redis.print);
        //RedisClient.expire(ROOM_MAP_KEY, 30, redis.print);
    });
    callback();
}
exports.setRoomsMap = setRoomsMap;
function getRoom(roomId, callback) {
    if (RedisClient_1.default.connected) {
        RedisClient_1.default.hget(RedisClient_1.ROOM_MAP_KEY, roomId, function (err, roomMap) {
            if (err || !roomMap) {
                console.log("Can't find room from cache");
                queryChatRoom().then(room => {
                    callback(null, room);
                }).catch(err => {
                    callback(err, null);
                });
            }
            else {
                let room = JSON.parse(roomMap);
                console.log("room from cache: ", room._id, room.name);
                callback(null, room);
            }
        });
    }
    else {
        queryChatRoom().then(room => {
            callback(null, room);
        }).catch(err => {
            callback(err, null);
        });
    }
    function queryChatRoom() {
        return __awaiter(this, void 0, void 0, function* () {
            let db = DbClient_1.getAppDb();
            let chatroom_coll = db.collection(config_1.DbClient.chatroomColl);
            let docs = yield chatroom_coll.find({ _id: new ObjectID(roomId) }).limit(1).toArray();
            if (docs.length > 0) {
                addRoom(docs[0]);
                return docs[0];
            }
            else {
                throw new Error("Can't find room");
            }
        });
    }
}
exports.getRoom = getRoom;
/**
* Require Room object. Must be { Room._id, Room.members }
*/
function addRoom(room) {
    RedisClient_1.default.hset(RedisClient_1.ROOM_MAP_KEY, room._id.toString(), JSON.stringify(room), redis.print);
    //RedisClient.expire(ROOM_MAP_KEY, 30, redis.print);
}
exports.addRoom = addRoom;
