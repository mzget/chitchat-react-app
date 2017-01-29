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
const mongodb = require("mongodb");
const router = express.Router();
const ObjectID = mongodb.ObjectID;
const MongoClient = mongodb.MongoClient;
const Room_1 = require("../../scripts/models/Room");
const GroupController = require("../../scripts/controllers/group/GroupController");
const apiUtils = require("../../scripts/utils/apiUtils");
const config_1 = require("../../config");
const webConfig = config_1.getConfig();
router.get("/org", function (req, res, next) {
    req.checkQuery("team_id", "request for team_id").isMongoId();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json(new apiUtils.ApiResponse(false, errors));
    }
    let team_id = new mongodb.ObjectID(req.query.team_id);
    GroupController.getOrgGroups(team_id).then(docs => {
        if (docs.length > 0) {
            res.status(200).json(new apiUtils.ApiResponse(true, null, docs));
        }
        else {
            res.status(500).json(new apiUtils.ApiResponse(false, docs));
        }
    }).catch(err => {
        res.status(500).json(new apiUtils.ApiResponse(false, err));
    });
});
router.post("/create", function (req, res, next) {
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
    function createGroup() {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield MongoClient.connect(webConfig.chatDB);
            let collection = db.collection(config_1.DbClient.chatroomColl);
            let result = yield collection.insertOne(roomModel);
            db.close();
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
router.post('/editOrg', function (req, res, next) {
    if (!!req && !!req.body) {
        console.log(req.body);
        MongoClient.connect(webConfig.chatDB, function (err, db) {
            if (err) {
                throw err;
            }
            var collection = db.collection(Mdb.DbClient.roomColl);
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
router.post('/inviteOrg', function (req, res, next) {
    if (!!req && !!req.body) {
        console.log(req.body);
        MongoClient.connect(webConfig.chatDB, function (err, db) {
            if (err) {
                throw err;
            }
            var collection = db.collection(Mdb.DbClient.roomColl);
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
router.post('/deleteGroupOrg', function (req, res, next) {
    if (!!req && !!req.body) {
        console.log(req.body);
        MongoClient.connect(webConfig.chatDB, function (err, db) {
            if (err) {
                throw err;
            }
            var collection = db.collection(Mdb.DbClient.roomColl);
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
router.post('/deleteMemberOrg', function (req, res, next) {
    if (!!req && !!req.body) {
        console.log(req.body);
        MongoClient.connect(webConfig.chatDB, function (err, db) {
            if (err) {
                throw err;
            }
            var collection = db.collection(Mdb.DbClient.roomColl);
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
module.exports = router;
