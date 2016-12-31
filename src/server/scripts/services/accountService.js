"use strict";
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
    get RoomsMap() {
        return this.roomsMap;
    }
    setRoomsMap(data, callback) {
        console.log("ChatService.setRoomMembers");
        if (!this.roomsMap)
            this.roomsMap = {};
        data.forEach(element => {
            var room = JSON.parse(JSON.stringify(element));
            if (!this.roomsMap[element.id]) {
                this.roomsMap[element._id] = room;
            }
        });
        callback();
    }
    getRoom(roomId, callback) {
        if (!this.roomsMap[roomId]) {
            callback("Have no a roomId in roomMembers dict.", null);
            return;
        }
        let room = this.roomsMap[roomId];
        callback(null, room);
    }
    /**
    * Require Room object. Must be { Room._id, Room.members }
    */
    addRoom(data) {
        let room = JSON.parse(JSON.stringify(data));
        if (!this.roomsMap[room._id]) {
            this.roomsMap[room._id] = room;
        }
        else {
            this.roomsMap[room._id] = room;
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AccountService;
