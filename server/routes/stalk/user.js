"use strict";
const express = require("express");
const mongodb = require("mongodb");
const apiUtils = require("../../scripts/utils/apiUtils");
const UserManager = require("../../scripts/controllers/user/UserManager");
const router = express.Router();
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
const config_1 = require("../../config");
const config = config_1.getConfig();
/* GET users listing. */
router.get("/lastAccessRoom", function (req, res, next) {
    let token = req['decoded'];
    let user_id = token._id;
    UserManager.getRoomAccessForUser(user_id).then(docs => {
        res.status(200).json(new apiUtils.ApiResponse(true, null, docs));
    }).catch(err => {
        console.error("getRoomAccessForUser Fail: ", err);
        res.status(500).json(new apiUtils.ApiResponse(false, err));
    });
});
router.post("/lastAccessRoom", function (req, res, next) {
    let token = req['decoded'];
    let user_id = token._id;
    UserManager.getRoomAccessForUser(user_id).then(docs => {
        res.status(200).json(new apiUtils.ApiResponse(true, null, docs));
    }).catch(err => {
        console.error("getRoomAccessForUser Fail: ", err);
        res.status(500).json(new apiUtils.ApiResponse(false, err));
    });
});
module.exports = router;
