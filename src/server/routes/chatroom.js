"use strict";
const express = require("express");
const crypto = require("crypto");
const mongodb = require("mongodb");
const async = require("async");
const router = express.Router();
const redis = require("redis");
const ObjectID = mongodb.ObjectID;
const CachingSevice_1 = require("../scripts/services/CachingSevice");
const Room = require("../scripts/models/Room");
const RoomService = require("../scripts/services/RoomService");
const ChatRoomManager_1 = require("../scripts/controllers/ChatRoomManager");
const UserManager = require("../scripts/controllers/UserManager");
const chatRoomManager = ChatRoomManager_1.ChatRoomManager.prototype;
/* GET home page. */
router.get('/', function (req, res, next) {
    next();
});
/**
/* Require owner memberId and roommate id.
* For get one-to-one chat room.
*/
router.post('/', function (req, res, next) {
    req.checkBody("ownerId", "request for ownerId").isMongoId();
    req.checkBody("roommateId", "request for roommateId").isMongoId();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }
    let id = '';
    let owner = req.body.ownerId;
    let roommate = req.body.roommateId;
    if (owner < roommate) {
        id = owner.concat(roommate);
    }
    else {
        id = roommate.concat(owner);
    }
    let md = crypto.createHash('md5');
    md.update(id);
    let hexCode = md.digest('hex');
    let roomId = hexCode.slice(0, 24);
    CachingSevice_1.default.hmget("rooms", roomId, (err, result) => {
        console.log("get room from cache", result);
        let room = JSON.parse(result[0]);
        if (err || room == null) {
            //@find from db..
            chatRoomManager.GetChatRoomInfo(roomId).then(function (results) {
                CachingSevice_1.default.hmset("rooms", roomId, JSON.stringify(results[0]), redis.print);
                res.status(200).json({ success: true, result: results });
            }).catch(err => {
                res.status(500).json({ success: false, message: err });
            });
        }
        else {
            res.status(200).json({ success: true, result: [room] });
        }
    });
});
/**
 * Create chatroom.
 */
router.post('/createPrivateRoom', function (req, res, next) {
    req.checkBody("owner", "request for owner user").notEmpty();
    req.checkBody("roommate", "request for roommate user").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }
    let id = '';
    let owner = req.body.owner;
    let roommate = req.body.roommate;
    if (owner._id < roommate._id) {
        id = owner._id.concat(roommate._id);
    }
    else {
        id = roommate._id.concat(owner._id);
    }
    let md = crypto.createHash('md5');
    md.update(id);
    let hexCode = md.digest('hex');
    let roomId = hexCode.slice(0, 24);
    let _tempArr = [owner, roommate];
    let _room = new Room.Room();
    _room._id = new ObjectID(roomId);
    _room.type = Room.RoomType.privateChat;
    _room.members = _tempArr;
    _room.createTime = new Date();
    chatRoomManager.createPrivateChatRoom(_room).then(function (results) {
        console.log("Create Private Chat Room: ", JSON.stringify(results));
        let _room = results[0];
        CachingSevice_1.default.hmset("rooms", _room._id, JSON.stringify(_room), redis.print);
        //<!-- Push updated lastAccessRoom fields to all members.
        async.map(results[0].members, function (member, cb) {
            //<!-- Add rid to user members lastAccessField.
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
    req.query("room_id", "request for room_id").isMongoId();
    req.query("user_id", "request for user_id").isMongoId();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }
    let room_id = req.body.room_id;
    let user_id = req.body.user_id;
    RoomService.checkedCanAccessRoom(room_id, user_id, function (err, result) {
        console.log("checkedCanAccessRoom: ", result);
        if (err || result === false) {
            res.status(500).json({ success: false, message: "cannot access your request room." });
        }
        else {
            chatRoomManager.GetChatRoomInfo(room_id).then(function (result) {
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
router.post('/clear_cache', (req, res, next) => {
    CachingSevice_1.default.del("rooms", function (err, reply) {
        console.log(err, reply);
        if (err)
            return res.status(500).json({ success: false, message: err });
        res.status(200).json({ success: true, result: reply });
    });
});
module.exports = router;
