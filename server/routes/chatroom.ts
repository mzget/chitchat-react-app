import express = require("express");
import crypto = require("crypto");
import mongodb = require("mongodb");
import async = require("async");
const router = express.Router();
import redis = require("redis");
const ObjectID = mongodb.ObjectID;
import redisClient, { ROOM_KEY } from "../scripts/services/CachingSevice";
import * as apiUtils from "../scripts/utils/apiUtils";
import { Room, IMember, RoomType } from "../scripts/models/Room";
import Message = require("../scripts/models/Message");
import * as RoomService from "../scripts/services/RoomService";
import * as AccountService from "../scripts/services/AccountService";
import * as ChatRoomManager from "../scripts/controllers/ChatRoomManager";
import * as UserManager from "../scripts/controllers/user/UserManager";

/* GET home page. */
router.get("/", function (req, res, next) {
    next();
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

    redisClient.hmget(ROOM_KEY, roomId, (err, result) => {
        let rooms = JSON.parse(JSON.stringify(result)) as Array<Room>;
        console.log("get room from cache", rooms);

        let room = null;
        if (rooms && rooms.length > 0) {
            room = JSON.parse(result[0]);
        }

        if (room !== null && room !== undefined) {
            res.status(200).json({ success: true, result: [room] });
        }
        else {
            // @find from db..
            console.log("find room from db...");
            ChatRoomManager.GetChatRoomInfo(roomId).then(function (results) {
                if (results.length > 0) {
                    redisClient.hmset(ROOM_KEY, roomId, JSON.stringify(results[0]), redis.print);
                    res.status(200).json({ success: true, result: results });
                }
                else {
                    res.status(500).json({ success: false, message: results });
                }
            }).catch(err => {
                res.status(500).json({ success: false, message: err });
            });
        }
    });
});

/**
 * Create chatroom.
 */
router.post("/createPrivateRoom", function (req, res, next) {
    req.checkBody("owner", "request for owner user").notEmpty();
    req.checkBody("roommate", "request for roommate user").notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }

    let id: string = "";
    let owner: IMember = req.body.owner;
    let roommate: IMember = req.body.roommate;
    if (owner._id < roommate._id) {
        id = owner._id.concat(roommate._id);
    }
    else {
        id = roommate._id.concat(owner._id);
    }

    let md = crypto.createHash("md5");
    md.update(id);
    let hexCode = md.digest("hex");
    let roomId = hexCode.slice(0, 24);
    let _tempArr = [owner, roommate];
    let _room = new Room();
    _room._id = new ObjectID(roomId);
    _room.type = RoomType.privateChat;
    _room.members = _tempArr;
    _room.createTime = new Date();
    ChatRoomManager.createPrivateChatRoom(_room).then(function (results) {
        console.log("Create Private Chat Room: ", JSON.stringify(results));

        let _room: Room = results[0];
        redisClient.hmset(ROOM_KEY, _room._id, JSON.stringify(_room), redis.print);

        // <!-- Push updated lastAccessRoom fields to all members.
        async.map(results[0].members, function (member: IMember, cb) {
            // <!-- Add rid to user members lastAccessField.
            UserManager.AddRoomIdToRoomAccessFieldForUser(results[0]._id, member._id, new Date()).then((res) => {
                console.log("add roomId to roomaccess fields", res);
                cb(null, null);
            }).catch(err => {
                cb(err, null);
            });
        }, function (errCb) {
            console.log("add roomId to roomaccess fields done.", errCb);
        });

        res.status(200).json({ success: true, result: results });
    }).catch(err => {
        console.warn("createPrivateChatRoom fail", err);
        res.status(500).json({ success: false, message: err });
    });
});

router.get("/roomInfo", (req, res, next) => {
    req.checkQuery("room_id", "request for room_id").isMongoId();

    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json(new apiUtils.ApiResponse(false, errors));
    }

    let room_id = req.query.room_id as string;
    let user_id = req["decoded"]._id as string;

    RoomService.checkedCanAccessRoom(room_id, user_id, function (err, result) {
        if (err || result === false) {
            res.status(500).json({ success: false, message: "cannot access your request room." });
        }
        else {
            ChatRoomManager.GetChatRoomInfo(room_id).then(function (result) {
                if (result.length > 0) {
                    res.status(200).json({ success: true, result: result });
                }
                else {
                    res.status(500).json({ success: false, message: "Your request roomInfo is no longer." });
                }
            }).catch(err => {
                res.status(500).json({ success: false, message: "Your request roomInfo is no longer." });
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

    let room_id: string = req.query.room_id;
    let user_id = req["decoded"]._id;
    let lastAccessTime: string = req.query.lastAccessTime;

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

router.post("/clear_cache", (req, res, next) => {
    redisClient.del(ROOM_KEY, function (err, reply) {
        console.log(err, reply);
        if (err) return res.status(500).json({ success: false, message: err });
        res.status(200).json({ success: true, result: reply });
    });
});


module.exports = router;