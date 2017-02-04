import express = require('express');
import mongodb = require('mongodb');

const router = express.Router();
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

import { getConfig, DbClient } from '../../config';
const webConfig = getConfig();

router.post("/username", (req, res, next) => {
    req.checkBody("username", "Request for id as body").notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }

    MongoClient.connect(webConfig.systemDB).then(db => {
        let collection = db.collection(DbClient.chitchatUserColl);

        collection.find({ username: req.body.username }).project({ password: 0 }).limit(1).toArray().then(function (docs) {
            if (docs.length >= 1) {
                res.status(200).json({ success: true, result: docs });
                db.close();
            }
            else {
                collection.insert({ username: req.body.username }).then(r => {
                    db.close();
                    res.status(200).json({ success: true, result: r.ops });
                }).catch(err => {
                    db.close();
                    res.status(500).json({ success: false, message: err + ': Cannot insert db.' });
                });
            }
        });
    }).catch(err => {
        console.error("Cannot connect db.", err);
        res.status(500).json({ success: false, message: err + ': Cannot connect db.' });
    });
});


module.exports = router;