"use strict";
const redis = require("redis");
const CachingSevice_1 = require("./CachingSevice");
class AccountService {
    constructor() {
        this.uidMap = {};
        this.nameMap = {};
        this.channelMap = {};
    }
    get OnlineUsers() {
        if (!this.onlineUsers)
            this.onlineUsers = {};
        return this.onlineUsers;
    }
    getOnlineUser(userId, cb) {
        if (!this.onlineUsers)
            this.onlineUsers = {};
        if (!this.onlineUsers[userId]) {
            let errMsg = "Specific uid is not online.";
            cb(errMsg, null);
            return;
        }
        let user = this.onlineUsers[userId];
        cb(null, user);
    }
    addOnlineUser(user, callback) {
        console.log("chatService.addOnlineUser");
        if (!this.onlineUsers)
            this.onlineUsers = {};
        if (!this.onlineUsers[user.uid]) {
            this.onlineUsers[user.uid] = user;
        }
        else {
            console.warn("onlineUsers dict already has value.!");
        }
        callback();
    }
    removeOnlineUser(userId) {
        delete this.onlineUsers[userId];
    }
    get userTransaction() {
        if (!this._userTransaction)
            this._userTransaction = {};
        return this._userTransaction;
    }
    /**
     * roomMembers the dict for keep roomId pair with array of uid who is a member of room.
     */
    setRoomsMap(data, callback) {
        data.forEach(element => {
            let room = JSON.parse(JSON.stringify(element));
            CachingSevice_1.default.hmset(CachingSevice_1.ROOM_MAP_KEY, element._id, JSON.stringify(room), redis.print);
        });
        callback();
    }
    getRoom(roomId, callback) {
        CachingSevice_1.default.hmget(CachingSevice_1.ROOM_MAP_KEY, roomId, function (err, roomMap) {
            if (err || roomMap[0] == null) {
                callback(err, null);
            }
            else {
                let room = JSON.parse(roomMap[0]);
                callback(null, room);
            }
        });
    }
    /**
    * Require Room object. Must be { Room._id, Room.members }
    */
    addRoom(room) {
        console.log("addRoom", room);
        CachingSevice_1.default.hmset(CachingSevice_1.ROOM_MAP_KEY, room._id, JSON.stringify(room), redis.print);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AccountService;
