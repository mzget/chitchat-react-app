"use strict";
const AccountService = require("./AccountService");
const accountService = new AccountService.AccountService();
exports.checkedCanAccessRoom = (roomId, userId, callback) => {
    AccountService.getRoom(roomId, (err, room) => {
        let result = false;
        if (err || !room) {
            console.error("getRoom fail", err.message);
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
