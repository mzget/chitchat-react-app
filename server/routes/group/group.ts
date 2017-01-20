﻿import express = require('express');
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
import * as UserManager from "../scripts/controllers/user/UserManager";
import * as apiUtils from '../../scripts/utils/apiUtils';

router.get('/getOrg', function (req, res, next) {

    MongoClient.connect(webConfig.chatDB, function (err, db) {
        if (err) {
            throw err;
        }
        var collection = db.collection(Mdb.DbClient.roomColl);
        collection.find({ type: 0 }).toArray().then(function (docs) {
            res.status(200).jsonp({ "success": true, "result": docs });
        });

    });
});

router.post('/createOrg', function (req, res, next) {
    req.checkBody('room', 'request for room object').notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json(new apiUtils.ApiResponse(false, errors));
    }

    var room = req.body;
    var roomModel = new MroomModel.RoomModel();
    roomModel.nodeId = room.nodeId;
    roomModel.name = room.name;
    roomModel.type = MroomModel.RoomType.organizationGroup;
    var members = JSON.stringify(room.members);
    roomModel.members = JSON.parse(members);
    roomModel.image = room.image;
    roomModel.description = room.description;
    roomModel.status = MroomModel.RoomStatus.active;
    roomModel.createTime = new Date();
    MongoClient.connect(webConfig.chatDB, function (err, db) {
        if (err) {
            throw err;
        }
        var collection = db.collection(Mdb.DbClient.roomColl);
        collection.insertOne(roomModel)
            .then(function onFulfilled(value) {
                res.status(200).json({ success: true, result: value });
                db.close();
            })
            .catch(function onRejected(error) {
                res.status(500).json({ success: false, message: error });
                db.close();
            });
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