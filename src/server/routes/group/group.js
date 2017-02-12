"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require("express");
const crypto = require("crypto");
const mongodb = require("mongodb");
const async = require("async");
const router = express.Router();
const ObjectID = mongodb.ObjectID;
const MongoClient = mongodb.MongoClient;
const Room_1 = require("../../scripts/models/Room");
const RoomService = require("../../scripts/services/RoomService");
const GroupController = require("../../scripts/controllers/group/GroupController");
const ChatRoomManager = require("../../scripts/controllers/ChatRoomManager");
const UserManager = require("../../scripts/controllers/user/UserManager");
const apiUtils = require("../../scripts/utils/apiUtils");
const DbClient_1 = require("../../scripts/DbClient");
const config_1 = require("../../config");
router.get("/org", function (req, res, next) {
    req.checkQuery("team_id", "request for team_id").isMongoId();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json(new apiUtils.ApiResponse(false, errors));
    }
    let team_id = req.query.team_id;
    let user_id = req["decoded"]._id;
    GroupController.getOrgGroups(team_id, user_id).then(docs => {
        res.status(200).json(new apiUtils.ApiResponse(true, null, docs));
    }).catch(err => {
        res.status(500).json(new apiUtils.ApiResponse(false, err));
    });
});
/**
 * Create org chart group chat.
 */
router.post("/org/create", function (req, res, next) {
    req.checkBody("room", "request for room object").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json(new apiUtils.ApiResponse(false, errors));
    }
    let room = req.body.room;
    if (!room.org_chart_id) {
        return res.status(500).json(new apiUtils.ApiResponse(false, "missing org_chart_id"));
    }
    let roomModel = new Room_1.Room();
    roomModel = __assign({}, room);
    roomModel.createTime = new Date();
    roomModel.status = Room_1.RoomStatus.active;
    function createGroup() {
        return __awaiter(this, void 0, void 0, function* () {
            if (roomModel.type != Room_1.RoomType.organizationGroup) {
                throw new Error("Invalid room type");
            }
            let db = DbClient_1.getAppDb();
            let collection = db.collection(config_1.DbClient.chatroomColl);
            let result = yield collection.insertOne(roomModel);
            RoomService.addRoom(result.ops[0]);
            return result.ops;
        });
    }
    ;
    createGroup().then(ops => {
        res.status(200).json(new apiUtils.ApiResponse(true, null, ops));
    }).catch(err => {
        res.status(500).json(new apiUtils.ApiResponse(false, err));
    });
});
/**
 * Create private group chat.
 */
router.post("/private_group/create", function (req, res, next) {
    req.checkBody("room", "request for room object").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json(new apiUtils.ApiResponse(false, errors));
    }
    let room = req.body.room;
    let roomModel = new Room_1.Room();
    roomModel = __assign({}, room);
    roomModel.createTime = new Date();
    roomModel.status = Room_1.RoomStatus.active;
    ChatRoomManager.createPrivateGroup(roomModel).then(docs => {
        if (docs.length > 0) {
            res.status(200).json(new apiUtils.ApiResponse(true, null, docs));
            let room = docs[0];
            RoomService.addRoom(room);
            // <!-- Update list of roomsMember mapping.
            pushNewRoomAccessToNewMembers(room._id.toString(), room.members);
        }
        else {
            res.status(500).json(new apiUtils.ApiResponse(false, "Can't add new private group"));
        }
    }).catch(err => {
        res.status(500).json(new apiUtils.ApiResponse(false, err));
    });
});
router.post("/editOrg", function (req, res, next) {
    if (!!req && !!req.body) {
        console.log(req.body);
        MongoClient.connect(config_1.Config.chatDB, function (err, db) {
            if (err) {
                throw err;
            }
            let collection = db.collection(Mdb.DbClient.roomColl);
            collection.findOneAndUpdate({ "_id": ObjectId(req.body._id) }, {
                $set: {
                    "name": req.body.name,
                    "description": req.body.description,
                    "status": req.body.status,
                    "nodeId": req.body.nodeId,
                    "image": req.body.image
                }
            }).then(function onFulfilled(value) {
                res.status(200).json({ success: true, result: value });
                db.close();
            })
                .catch(function onRejected(error) {
                res.status(500).json({ success: false, message: error });
                db.close();
            });
        });
    }
    else {
        res.json(500, { "success": false });
    }
});
router.post("/inviteOrg", function (req, res, next) {
    if (!!req && !!req.body) {
        console.log(req.body);
        MongoClient.connect(config_1.Config.chatDB, function (err, db) {
            if (err) {
                throw err;
            }
            let collection = db.collection(Mdb.DbClient.roomColl);
            collection.findOneAndUpdate({ "_id": ObjectId(req.body._id) }, { $push: { members: { $each: req.body.members } } }).then(function onFulfilled(value) {
                res.status(200).json({ success: true, result: value });
                db.close();
            })
                .catch(function onRejected(error) {
                res.status(500).json({ success: false, message: error });
                db.close();
            });
        });
    }
    else {
        res.json(500, { "success": false });
    }
});
router.post("/deleteGroupOrg", function (req, res, next) {
    if (!!req && !!req.body) {
        console.log(req.body);
        MongoClient.connect(config_1.Config.chatDB, function (err, db) {
            if (err) {
                throw err;
            }
            let collection = db.collection(Mdb.DbClient.roomColl);
            collection.deleteOne({ "_id": ObjectId(req.body._id) }).then(function onFulfilled(value) {
                res.status(200).json({ success: true, result: value });
                db.close();
            })
                .catch(function onRejected(error) {
                res.status(500).json({ success: false, message: error });
                db.close();
            });
        });
    }
    else {
        res.json(500, { "success": false });
    }
});
router.post("/deleteMemberOrg", function (req, res, next) {
    if (!!req && !!req.body) {
        console.log(req.body);
        MongoClient.connect(config_1.Config.chatDB, function (err, db) {
            if (err) {
                throw err;
            }
            let collection = db.collection(Mdb.DbClient.roomColl);
            collection.findOneAndUpdate({ "_id": ObjectId(req.body._id) }, { $pull: { "members": req.body.members } }).then(function onFulfilled(value) {
                res.status(200).json({ success: true, result: value });
                db.close();
            })
                .catch(function onRejected(error) {
                res.status(500).json({ success: false, message: error });
                db.close();
            });
        });
    }
    else {
        res.json(500, { "success": false });
    }
});
/**
 * Create private chatroom.
 */
router.post("/private_chat/create", function (req, res, next) {
    req.checkBody("owner", "request for owner user").notEmpty();
    req.checkBody("roommate", "request for roommate user").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }
    let id = "";
    let owner = req.body.owner;
    let roommate = req.body.roommate;
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
    let _room = new Room_1.Room();
    _room._id = new ObjectID(roomId);
    _room.type = Room_1.RoomType.privateChat;
    _room.members = _tempArr;
    _room.createTime = new Date();
    ChatRoomManager.createPrivateChatRoom(_room).then(function (results) {
        console.log("Create Private Chat Room: ", JSON.stringify(results));
        let _room = results[0];
        RoomService.addRoom(_room);
        // <!-- Push updated lastAccessRoom fields to all members.
        async.map(results[0].members, function (member, cb) {
            // <!-- Add rid to user members lastAccessField.
            UserManager.AddRoomIdToRoomAccessFieldOfUser(results[0]._id, member._id, new Date()).then((res) => {
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
function pushNewRoomAccessToNewMembers(rid, targetMembers) {
    let memberIds = new Array();
    async.map(targetMembers, function iterator(item, cb) {
        memberIds.push(item._id);
        cb(null, null);
    }, function done(err, results) {
        console.warn("==> Next we will push new room info to all new room.members");
        console.warn("==> Add rid to roomAccess data for each member. And then push new roomAccess info to all members.");
        UserManager.AddRoomIdToRoomAccessFieldOfUsers(rid, memberIds, new Date());
    });
}
module.exports = router;
