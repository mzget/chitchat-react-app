import express = require("express");
import crypto = require("crypto");
import mongodb = require("mongodb");
import async = require("async");
import redis = require("redis");

const router = express.Router();
const ObjectID = mongodb.ObjectID;
const MongoClient = mongodb.MongoClient;

import { Room, RoomType, RoomStatus, IMember } from "../../scripts/models/Room";

import * as GroupController from "../../scripts/controllers/group/GroupController";
import * as ChatRoomManager from "../../scripts/controllers/ChatRoomManager";
import * as UserManager from "../../scripts/controllers/user/UserManager";
import * as apiUtils from "../../scripts/utils/apiUtils";

import { Config, DbClient } from "../../config";

router.get("/org", function (req, res, next) {
    req.checkQuery("team_id", "request for team_id").isMongoId();

    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json(new apiUtils.ApiResponse(false, errors));
    }

    let team_id = req.query.team_id as string;
    let user_id = req["decoded"]._id;

    GroupController.getOrgGroups(team_id, user_id).then(docs => {
        res.status(200).json(new apiUtils.ApiResponse(true, null, docs));
    }).catch(err => {
        res.status(500).json(new apiUtils.ApiResponse(false, err));
    });
});

router.post("/org/create", function (req, res, next) {
    req.checkBody("room", "request for room object").notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json(new apiUtils.ApiResponse(false, errors));
    }

    let room = req.body.room as Room;
    if (!room.org_chart_id) { return res.status(500).json(new apiUtils.ApiResponse(false, "missing org_chart_id")); }

    let roomModel = new Room();
    roomModel = { ...room } as Room;
    roomModel.createTime = new Date();
    roomModel.status = RoomStatus.active;

    async function createGroup() {
        let db = await MongoClient.connect(Config.chatDB);
        let collection = db.collection(DbClient.chatroomColl);

        let result = await collection.insertOne(roomModel);
        db.close();
        return result.ops;
    };

    createGroup().then(ops => {
        res.status(200).json(new apiUtils.ApiResponse(true, null, ops));
    }).catch(err => {
        res.status(500).json(new apiUtils.ApiResponse(false, err));
    });
});

router.post("/editOrg", function (req, res, next) {
    if (!!req && !!req.body) {
        console.log(req.body);
        MongoClient.connect(Config.chatDB, function (err, db) {
            if (err) {
                throw err;
            }
            let collection = db.collection(Mdb.DbClient.roomColl);
            collection.findOneAndUpdate(
                { "_id": ObjectId(req.body._id) },
                {
                    $set: {
                        "name": req.body.name,
                        "description": req.body.description,
                        "status": req.body.status,
                        "nodeId": req.body.nodeId,
                        "image": req.body.image
                    }
                }
            ).then(function onFulfilled(value) {
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
        MongoClient.connect(Config.chatDB, function (err, db) {
            if (err) {
                throw err;
            }
            let collection = db.collection(Mdb.DbClient.roomColl);
            collection.findOneAndUpdate(
                { "_id": ObjectId(req.body._id) },
                { $push: { members: { $each: req.body.members } } }
            ).then(function onFulfilled(value) {
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
        MongoClient.connect(Config.chatDB, function (err, db) {
            if (err) {
                throw err;
            }
            let collection = db.collection(Mdb.DbClient.roomColl);
            collection.deleteOne(
                { "_id": ObjectId(req.body._id) }
            ).then(function onFulfilled(value) {
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
        MongoClient.connect(Config.chatDB, function (err, db) {
            if (err) {
                throw err;
            }
            let collection = db.collection(Mdb.DbClient.roomColl);
            collection.findOneAndUpdate(
                { "_id": ObjectId(req.body._id) },
                { $pull: { "members": req.body.members } }
                // { $pull: { members: { $in: req.body.members  } } }
            ).then(function onFulfilled(value) {
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