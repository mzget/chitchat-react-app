import express = require('express');
import mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const router = express.Router();
import { getConfig, DbClient } from '../config';
const config = getConfig();

router.post('/teamInfo', function (req, res, next) {
    req.checkBody('id', 'request for team_id').isMongoId();

    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }

    MongoClient.connect(config.chatDB).then(function (db) {
        let collection = db.collection(Mdb.DbClient.companyColl);

        collection.find({ _id: new mongodb.ObjectID(req.body.id) }).limit(1).toArray().then(function (docs) {
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
