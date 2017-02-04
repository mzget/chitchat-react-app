"use strict";
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
const apiUtils = require("../../scripts/utils/apiUtils");
const UserManager = require("../../scripts/controllers/user/UserManager");
const router = express.Router();
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
/* GET users listing. */
router.get("/lastAccessRoom", function (req, res, next) {
    let token = req["decoded"];
    let user_id = token._id;
    UserManager.getRoomAccessForUser(user_id).then(docs => {
        res.status(200).json(new apiUtils.ApiResponse(true, null, docs));
    }).catch(err => {
        console.error("getRoomAccessForUser Fail: ", err);
        res.status(500).json(new apiUtils.ApiResponse(false, err));
    });
});
router.post("/lastAccessRoom", function (req, res, next) {
    req.checkBody("room_id", "request for room_id").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json(new apiUtils.ApiResponse(false, errors));
    }
    let token = req["decoded"];
    let user_id = token._id;
    let room_id = req.body.room_id;
    function update() {
        return __awaiter(this, void 0, void 0, function* () {
            let accessInfo = yield UserManager.updateLastAccessTimeOfRoom(user_id, room_id, new Date());
            console.log("updateLastAccessTimeOfRoom rid is %s: ", room_id, accessInfo);
            let docs = yield UserManager.getRoomAccessOfRoom(user_id, room_id);
            return docs;
        });
    }
    update().then(docs => {
        res.status(200).json(new apiUtils.ApiResponse(true, null, docs));
    }).catch(err => {
        res.status(500).json(new apiUtils.ApiResponse(false, err));
    });
});
module.exports = router;
