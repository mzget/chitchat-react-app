"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const crypto = require("crypto");
const mongodb = require("mongodb");
const apiUtils = require("../scripts/utils/apiUtils");
const RoomService = require("../scripts/services/RoomService");
const ChatRoomManager = require("../scripts/controllers/ChatRoomManager");
const UserManager = require("../scripts/controllers/user/UserManager");
const router = express.Router();
const ObjectID = mongodb.ObjectID;
/* GET home page. */
router.get("/", function (req, res, next) {
    req.checkQuery("room_id", "request for room_id").isMongoId();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json(new apiUtils.ApiResponse(false, errors));
    }
    let room_id = req.query.room_id;
    RoomService.getRoom(room_id, function (err, result) {
        if (err || !result) {
            res.status(500).json(new apiUtils.ApiResponse(false, "can't find roomId!"));
        }
        else {
            res.status(200).json(new apiUtils.ApiResponse(true, null, [result]));
        }
    });
});
/**
/* Require owner memberId and roommate id.
* For get one-to-one chat room.
*/
router.post("/", function (req, res, next) {
    req.checkBody("ownerId", "request for ownerId").isMongoId();
    req.checkBody("roommateId", "request for roommateId").isMongoId();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }
    let id = "";
    let owner = req.body.ownerId;
    let roommate = req.body.roommateId;
    if (owner < roommate) {
        id = owner.concat(roommate);
    }
    else {
        id = roommate.concat(owner);
    }
    let md = crypto.createHash("md5");
    md.update(id);
    let hexCode = md.digest("hex");
    let roomId = hexCode.slice(0, 24);
    RoomService.getRoom(roomId, (err, room) => {
        if (err) {
            res.status(500).json(new apiUtils.ApiResponse(false, err));
        }
        else {
            res.status(200).json(new apiUtils.ApiResponse(true, null, [room]));
        }
    });
});
router.get("/roomInfo", (req, res, next) => {
    req.checkQuery("room_id", "request for room_id").isMongoId();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json(new apiUtils.ApiResponse(false, errors));
    }
    let room_id = req.query.room_id;
    let user_id = req["decoded"]._id;
    RoomService.checkedCanAccessRoom(room_id, user_id, function (err, result) {
        if (err || result === false) {
            res.status(500).json(new apiUtils.ApiResponse(false, "cannot access your request room."));
        }
        else {
            RoomService.getRoom(room_id, (err, room) => {
                res.status(200).json(new apiUtils.ApiResponse(true, null, [room]));
            });
        }
    });
});
/**
 * require: roomId, lastAccessTimeOfRoom
 * **********************************************
 *@return : unread message count of room.
 *@return : last message of room.
 */
router.get("/unreadMessage", (req, res, next) => {
    req.checkQuery("room_id", "request for room_id").isMongoId();
    req.checkQuery("lastAccessTime", "request for lastAccessTime").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json(new apiUtils.ApiResponse(false, errors));
    }
    let room_id = req.query.room_id;
    let user_id = req["decoded"]._id;
    let lastAccessTime = req.query.lastAccessTime;
    RoomService.checkedCanAccessRoom(room_id, user_id, function (err, result) {
        if (err || result === false) {
            res.status(500).json({ success: false, message: "cannot access your request room." + err });
        }
        else {
            ChatRoomManager.getUnreadMsgCountAndLastMsgContentInRoom(room_id, lastAccessTime).then(results => {
                res.status(200).json({ success: true, result: results });
            }).catch(err => {
                res.status(500).json({ success: false, message: err });
            });
        }
    });
});
router.post("/checkOlderMessagesCount", (req, res, next) => {
    req.checkBody("room_id", "request for room_id").notEmpty();
    req.checkBody("topEdgeMessageTime", "request for topEdgeMessageTime").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json(new apiUtils.ApiResponse(false, errors));
    }
    let room_id = req.body.room_id;
    let topEdgeMessageTime = req.body.topEdgeMessageTime;
    ChatRoomManager.getOlderMessageChunkCount(room_id, topEdgeMessageTime).then(docs => {
        res.status(200).json(new apiUtils.ApiResponse(true, null, docs));
    }).catch(err => {
        console.error("getOlderMessageChunkOfRid fail", err);
        res.status(500).json(new apiUtils.ApiResponse(false, err));
    });
});
router.post("/getChatHistory", (req, res, next) => {
    req.checkBody("room_id", "request for room_id").notEmpty();
    req.checkBody("lastMessageTime", "request for lastMessageTime").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json(new apiUtils.ApiResponse(false, errors));
    }
    let room_id = req.body.room_id;
    let lastMessageTime = req.body.lastMessageTime;
    let token = req["decoded"];
    let user_id = token._id;
    let utc = new Date(lastMessageTime);
    ChatRoomManager.getNewerMessageOfChatRoom(room_id, utc).then(docs => {
        res.status(200).json(new apiUtils.ApiResponse(true, null, docs));
        // <!-- When get chat history complete. System will update roomAccess data for user.
        UserManager.updateLastAccessTimeOfRoom(user_id, room_id, new Date()).then(accessInfo => {
            console.log("updateLastAccessTimeOfRoom rid is %s: ", room_id, accessInfo.nModified);
        });
        /*
                userManager.updateLastAccessTimeOfRoom(user.uid, rid, new Date(), function (err, accessInfo) {
                    let printR = (accessInfo) ? accessInfo.result : null;
                    console.log("chatRemote.kick : updateLastAccessRoom rid is %s: ", rid, printR);

                    userManager.getRoomAccessOfRoom(uid, rid, function (err, res) {
                        console.log("chatRemote.kick : getLastAccessOfRoom of %s", rid, res);
                        if (err || res.length <= 0) return;

                        let targetId = { uid: user.uid, sid: user.serverId };
                        let group = new Array();
                        group.push(targetId);

                        let param = {
                            route: Code.sharedEvents.onUpdatedLastAccessTime,
                            data: res[0]
                        };

                        channelService.pushMessageByUids(param.route, param.data, group);
                    });
                });*/
    }).catch(err => {
        console.error("getChatHistory fail: ", err);
        res.status(500).json(new apiUtils.ApiResponse(false, err));
    });
});
module.exports = router;
