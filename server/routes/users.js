"use strict";
const express = require("express");
const mongodb = require("mongodb");
const router = express.Router();
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
const config_1 = require("../config");
const webConfig = config_1.getConfig();
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
router.get('/:username', (req, res, next) => {
    req.checkParams("username", "Request for id as param").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }
    MongoClient.connect(webConfig.appDB).then(db => {
        let collection = db.collection(config_1.DbClient.user);
        collection.find({ username: req.params.username }).project({ password: 0 }).limit(1).toArray().then(function (docs) {
            if (docs.length >= 1) {
                res.status(200).json({ success: true, result: docs });
                db.close();
            }
            else {
                res.status(500).json({ success: false, message: "no user data." });
                db.close();
            }
        });
    }).catch(err => {
        res.status(500).json({ success: false, message: err });
    });
});
module.exports = router;
