"use strict";
const express = require("express");
const crypto = require("crypto");
const mongodb = require("mongodb");
const router = express.Router();
const ObjectID = mongodb.ObjectID;
const ChatRoomManager_1 = require("../scripts/controllers/ChatRoomManager");
const UserManager = require("../scripts/controllers/UserManager");
const chatRoomManager = ChatRoomManager_1.ChatRoomManager.prototype;
/* GET home page. */
router.get('/', function (req, res, next) {
    next();
});
/**
/* Require owner memberId and roommate id.
* For get or create one-to-one chat room.
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
    chatRoomManager.GetChatRoomInfo({ _id: new ObjectID(roomId) }).then(function (results) {
        console.log("GetChatRoomInfo", results);
        if (results.length > 0) {
            res.status(200).json({ success: true, result: results });
        }
        else {
            chatRoomManager.createPrivateChatRoom({ _id: new ObjectID(roomId), members: [owner, roommate] }).then(function (result) {
                console.info("Create Private Chat Room: ", result);
                res.status(200).json({ success: true, result: result });
                let roomId = result._id;
                let members = new Array();
                for (var i in result.members) {
                    members.push(result.members[i]);
                }
                //<!-- Push updated lastAccessRoom fields to all members.
                async.each(members, function (member, cb) {
                    //<!-- Add rid to user members lastAccessField.
                    UserManager.AddRoomIdToRoomAccessFieldForUser(roomId, member.id, new Date()).then((res) => {
                        console.log("add roomId to roomaccess fields", res);
                        cb();
                    });
                }, function (errCb) {
                    if (errCb)
                        console.log("add roomId to roomaccess fields", errCb);
                });
            }).catch(err => {
                res.status(500).json({ success: false, message: err });
            });
        }
    }).catch(err => {
        res.status(500).json({ success: false, message: err });
    });
});
module.exports = router;
