"use strict";
const express = require("express");
const mongodb = require("mongodb");
const apiUtils = require("../scripts/utils/apiUtils");
const MongoClient = mongodb.MongoClient;
const router = express.Router();
const config_1 = require("../config");
const config = config_1.getConfig();
const TeamController = require("../scripts/controllers/team/TeamController");
const UserManager = require("../scripts/controllers/user/UserManager");
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
router.post('/create', (req, res, next) => {
    req.checkBody('team_name', 'request for team_name').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }
    let team_name = req.body.team_name;
    let user = req.decoded;
    //@ Find team_name for check it already used.
    TeamController.findTeamName(team_name).then(teams => {
        if (teams.length > 0)
            throw new Error("team name already used.");
        else
            return TeamController.createTeam(team_name);
    }).then(result => {
        res.status(200).json(new apiUtils.ApiResponse(true, null, result));
        UserManager.joinTeam(result[0], user._id);
    }).catch(err => {
        console.error("findTeamName fail: ", err);
        res.status(500).json(new apiUtils.ApiResponse(false, err));
    });
});
module.exports = router;
