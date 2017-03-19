"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
}
exports.AccountService = AccountService;
