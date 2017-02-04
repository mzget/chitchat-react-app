import express = require("express");
import mongodb = require("mongodb");

import * as apiUtils from "../../scripts/utils/apiUtils";

import * as UserManager from "../../scripts/controllers/user/UserManager";

const router = express.Router();
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

import { config } from "../../config";

/* GET users listing. */
router.get("/lastAccessRoom", function (req, res, next) {
    let token = req["decoded"];
    let user_id: string = token._id;

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
    let user_id: string = token._id;
    let room_id = req.body.room_id as string;

    async function update() {
        let accessInfo = await UserManager.updateLastAccessTimeOfRoom(user_id, room_id, new Date());
        console.log("updateLastAccessTimeOfRoom rid is %s: ", room_id, accessInfo.nModified);
        let docs = await UserManager.getRoomAccessOfRoom(user_id, room_id);

        return docs;
    }

    update().then(docs => {
        res.status(200).json(new apiUtils.ApiResponse(true, null, docs));
    }).catch(err => {
        res.status(500).json(new apiUtils.ApiResponse(false, err));
    });
});

module.exports = router;
