import express = require('express');
import crypto = require('crypto');
import mongodb = require('mongodb');
import async = require('async');
import redis = require('redis');

const router = express.Router();
const ObjectID = mongodb.ObjectID;
const MongoClient = mongodb.MongoClient;
import redisClient, { ROOM_KEY } from "../scripts/services/CachingSevice";

import { Room, RoomType, RoomStatus, Member } from "../../scripts/models/Room";
import Message = require("../scripts/models/Message");
import * as RoomService from "../scripts/services/RoomService";

import * as GroupController from "../../scripts/controllers/group/GroupController";
import * as ChatRoomManager from "../../scripts/controllers/ChatRoomManager";
import * as UserManager from "../../scripts/controllers/user/UserManager";
import * as apiUtils from "../../scripts/utils/apiUtils";

import { getConfig, DbClient } from "../../config";
const webConfig = getConfig();

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

    let room = req.body.room as Room;
    let roomModel = new Room();
    roomModel = { ...room } as Room;
    roomModel.createTime = new Date();
    roomModel.status = RoomStatus.active;

    async function createGroup() {
        let db = await MongoClient.connect(webConfig.chatDB);
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

router.post('/editOrg', function (req, res, next) {
    if (!!req && !!req.body) {
        console.log(req.body);
        MongoClient.connect(webConfig.chatDB, function (err, db) {
            if (err) {
                throw err;
            }
            var collection = db.collection(Mdb.DbClient.roomColl);
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

router.post('/inviteOrg', function (req, res, next) {
    if (!!req && !!req.body) {
        console.log(req.body);
        MongoClient.connect(webConfig.chatDB, function (err, db) {
            if (err) {
                throw err;
            }
            var collection = db.collection(Mdb.DbClient.roomColl);
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

router.post('/deleteGroupOrg', function (req, res, next) {
    if (!!req && !!req.body) {
        console.log(req.body);
        MongoClient.connect(webConfig.chatDB, function (err, db) {
            if (err) {
                throw err;
            }
            var collection = db.collection(Mdb.DbClient.roomColl);
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

router.post('/deleteMemberOrg', function (req, res, next) {
    if (!!req && !!req.body) {
        console.log(req.body);
        MongoClient.connect(webConfig.chatDB, function (err, db) {
            if (err) {
                throw err;
            }
            var collection = db.collection(Mdb.DbClient.roomColl);
            collection.findOneAndUpdate(
                { "_id": ObjectId(req.body._id) },
                { $pull: { "members": req.body.members } }
                //{ $pull: { members: { $in: req.body.members  } } }
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