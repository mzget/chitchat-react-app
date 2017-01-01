import express = require('express');
import crypto = require('crypto');
import mongodb = require('mongodb');
import async = require('async');
const router = express.Router();
import redis = require('redis');
const ObjectID = mongodb.ObjectID;
import redisClient, { ROOM_KEY } from "../scripts/services/CachingSevice";

import Room = require("../scripts/models/Room");
import Message = require("../scripts/models/Message");
import * as RoomService from "../scripts/services/RoomService";

import * as ChatRoomManager from "../scripts/controllers/ChatRoomManager";
import * as UserManager from "../scripts/controllers/UserManager";

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

    redisClient.hmget(ROOM_KEY, roomId, (err, result) => {
        console.log("get room from cache", result);
        if (err || result == null) {
            //@find from db..
            ChatRoomManager.GetChatRoomInfo(roomId).then(function (results) {
                redisClient.hmset(ROOM_KEY, roomId, JSON.stringify(results[0]), redis.print);
                res.status(200).json({ success: true, result: results });
            }).catch(err => {
                res.status(500).json({ success: false, message: err });
            });
        }
        else {
            let room: Room.Room = JSON.parse(result[0]);
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

    let id: string = '';
    let owner: Room.Member = req.body.owner;
    let roommate: Room.Member = req.body.roommate;
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
    ChatRoomManager.createPrivateChatRoom(_room).then(function (results) {
        console.log("Create Private Chat Room: ", JSON.stringify(results));

        let _room: Room.Room = results[0];
        redisClient.hmset(ROOM_KEY, _room._id, JSON.stringify(_room), redis.print);

        //<!-- Push updated lastAccessRoom fields to all members.
        async.map(results[0].members, function (member: Room.Member, cb) {
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
    req.checkQuery("room_id", "request for room_id").isMongoId();
    req.checkQuery("user_id", "request for user_id").isMongoId();

    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }

    let room_id = req.query.room_id;
    let user_id = req.query.user_id;

    RoomService.checkedCanAccessRoom(room_id, user_id, function (err, result) {
        console.log("checkedCanAccessRoom: ", result);

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
router.get('/unreadMessage', (req, res, next) => {
    req.checkQuery("room_id", "request for room_id").isMongoId();
    req.checkQuery("user_id", "request for user_id").isMongoId();
    req.checkQuery('lastAccessTime', "request for lastAccessTime").notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }

    let room_id: string = req.query.room_id;
    let user_id: string = req.query.user_id;
    let lastAccessTime: string = req.query.lastAccessTime;

    RoomService.checkedCanAccessRoom(room_id, user_id, function (err, result) {
        if (err || result === false) {
            res.status(500).json({ success: false, message: "cannot access your request room." + err });
        }
        else {
            ChatRoomManager.getUnreadMsgCountAndLastMsgContentInRoom(room_id, lastAccessTime, function (err, result2) {
                if (err) {
                    res.status(500).json({ success: false, message: err });
                }
                else {
                    res.status(200).json({ success: true, result: result2 });
                }
            });
        }
    });
});

router.post('/clear_cache', (req, res, next) => {
    redisClient.del(ROOM_KEY, function (err, reply) {
        console.log(err, reply);
        if (err) return res.status(500).json({ success: false, message: err });
        res.status(200).json({ success: true, result: reply });
    });
})


module.exports = router;