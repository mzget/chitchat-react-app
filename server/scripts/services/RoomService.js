"use strict";
const mongodb = require("mongodb");
const redis = require("redis");
const CachingSevice_1 = require("./CachingSevice");
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
                    if (value._id === userId) {
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
        CachingSevice_1.default.hmset(CachingSevice_1.ROOM_MAP_KEY, element._id, JSON.stringify(room), redis.print);
    });
    callback();
}
exports.setRoomsMap = setRoomsMap;
function getRoom(roomId, callback) {
    CachingSevice_1.default.hmget(CachingSevice_1.ROOM_MAP_KEY, roomId, function (err, roomMap) {
        if (err || roomMap[0] == null || roomMap[0] == undefined) {
            console.log("Can't find room from cache");
            let db = DbClient_1.getAppDb();
            let chatroom_coll = db.collection(config_1.DbClient.chatroomColl);
            chatroom_coll.find({ _id: new ObjectID(roomId) }).limit(1).toArray().then(docs => {
                if (docs.length > 0) {
                    addRoom(docs[0]);
                    callback(null, docs[0]);
                }
                else {
                    callback(new Error("Can't find room"), null);
                }
            }).catch(err => {
                callback(new Error("Can't find room: " + err), null);
            });
        }
        else {
            let room = JSON.parse(roomMap[0]);
            callback(null, room);
        }
    });
}
exports.getRoom = getRoom;
/**
* Require Room object. Must be { Room._id, Room.members }
*/
function addRoom(room) {
    CachingSevice_1.default.hmset(CachingSevice_1.ROOM_MAP_KEY, room._id, JSON.stringify(room), redis.print);
}
exports.addRoom = addRoom;
