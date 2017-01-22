import express = require('express');
import mongodb = require('mongodb');

import * as apiUtils from '../../scripts/utils/apiUtils';

import * as UserManager from '../../scripts/controllers/user/UserManager';

const router = express.Router();
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

import { getConfig, DbClient } from '../../config';
const config = getConfig();

/* GET users listing. */
router.get('/lastAccessRoom', function (req, res, next) {
    let token = req['decoded'];
    let user_id: string = token._id;

    UserManager.getRoomAccessForUser(user_id).then(docs => {
        if (docs.length > 0)
            res.status(200).json(new apiUtils.ApiResponse(true, null, docs));
        else
            res.status(500).json(new apiUtils.ApiResponse(false, docs));
    }).catch(err => {
        console.error("getRoomAccessForUser Fail: ", err);
        res.status(500).json(new apiUtils.ApiResponse(false, err));
    });
});

module.exports = router;
