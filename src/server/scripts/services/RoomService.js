"use strict";
const AccountService_1 = require("./AccountService");
const accountService = new AccountService_1.default();
exports.checkedCanAccessRoom = (roomId, userId, callback) => {
    accountService.getRoom(roomId, (err, room) => {
        let result = false;
        if (err || !room) {
            console.warn("getRoom fail", err);
            callback(null, result);
        }
        else {
            console.log("getRoom success", room._id);
            result = room.members.some(value => {
                if (value._id === userId) {
                    return true;
                }
            });
            callback(null, result);
        }
    });
};
