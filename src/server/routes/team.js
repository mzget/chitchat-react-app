"use strict";
const express = require("express");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const router = express.Router();
const config_1 = require("../config");
const config = config_1.getConfig();
router.post('/teamInfo', function (req, res, next) {
    req.checkBody('team_id', 'request for team_id').isMongoId();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }
    let team_id = new mongodb.ObjectID(req.body.team_id);
    MongoClient.connect(config.chatDB).then(function (db) {
        let collection = db.collection(config_1.DbClient.teamsColl);
        collection.createIndex({ name: 1 }, { background: true });
        collection.find({ _id: team_id }).limit(1).toArray().then(function (docs) {
            if (docs.length >= 1) {
                res.status(200).json({ success: true, result: docs[0] });
                db.close();
            }
            else {
                res.status(500).json({ success: false, message: 'No have teamInfo' });
                db.close();
            }
        });
    }).catch(err => {
        console.error('/teamInfo: ', err);
        res.status(500).json({ success: false, message: req.url + err });
    });
});
module.exports = router;
