import mongodb = require("mongodb");
import redis = require("redis");
import RedisClient, { ROOM_MAP_KEY, redisStatus, RedisStatus } from "./RedisClient";

import { Config, DbClient } from "../../config";
import { getAppDb } from "../DbClient";
import * as Room from "../models/Room";

const { ObjectID } = mongodb;

export const checkedCanAccessRoom = (roomId: string, userId: string, callback: (err: Error, res: boolean) => void) => {
    getRoom(roomId, (err, room) => {
        let result: boolean = false;
        if (err || !room) {
            console.error("getRoom fail", err);
            callback(null, result);
        }
        else {
            if (room.members && Array.isArray(room.members)) {
                let members = room.members as Array<any>;
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
export function setRoomsMap(data: Array<any>, callback: () => void) {
    data.forEach(element => {
        let room: Room.Room = JSON.parse(JSON.stringify(element));
        RedisClient.hset(ROOM_MAP_KEY, element._id.toString(), JSON.stringify(room), redis.print);
        //RedisClient.expire(ROOM_MAP_KEY, 30, redis.print);
    });

    callback();
}

export function getRoom(roomId: string, callback: (err: any, res: Room.Room) => void) {
    if (redisStatus == RedisStatus.ready) {
        RedisClient.hget(ROOM_MAP_KEY, roomId, function (err, roomMap) {
            if (err || !roomMap) {
                console.log("Can't find room from cache");

                queryChatRoom().then(room => {
                    callback(null, room);
                }).catch(err => {
                    callback(err, null);
                });
            }
            else {
                let room = JSON.parse(roomMap) as Room.Room;
                console.log("room from cache: ", room);
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

    async function queryChatRoom() {
        let db = getAppDb();
        let chatroom_coll = db.collection(DbClient.chatroomColl);
        let docs = await chatroom_coll.find({ _id: new ObjectID(roomId) }).limit(1).toArray();
        if (docs.length > 0) {
            addRoom(docs[0]);
            return docs[0];
        } else {
            throw new Error("Can't find room");
        }
    }
}

/**
* Require Room object. Must be { Room._id, Room.members }
*/
export function addRoom(room: Room.Room) {
    RedisClient.hset(ROOM_MAP_KEY, room._id.toString(), JSON.stringify(room), redis.print);
    //RedisClient.expire(ROOM_MAP_KEY, 30, redis.print);
}