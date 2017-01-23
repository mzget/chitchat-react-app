import express = require('express');
import mongodb = require('mongodb');

import * as apiUtils from '../scripts/utils/apiUtils';

import { ITeam } from '../scripts/models/ITeam';

const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
const router = express.Router();
import { getConfig, DbClient } from '../config';
const config = getConfig();

import * as TeamController from '../scripts/controllers/team/TeamController';
import * as UserManager from '../scripts/controllers/user/UserManager';

router.get("/", (req, res, next) => {
    req.checkQuery("name", "request for name param").notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json(new apiUtils.ApiResponse(false, errors));
    }

    let team_name = req.query.name;
    TeamController.findTeamName(team_name).then(value => {
        if (value.length > 0)
            res.status(200).json(new apiUtils.ApiResponse(true, null, value));
        else
            res.status(500).json(new apiUtils.ApiResponse(false, value));
    }).catch(err => {
        console.error("Find team name fail: ", err);
        res.status(500).json(new apiUtils.ApiResponse(false, err));
    });
});

router.post('/teamInfo', function (req, res, next) {
    req.checkBody('team_id', 'request for team_id').isMongoId();

    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }

    let team_id = new mongodb.ObjectID(req.body.team_id);

    MongoClient.connect(config.chatDB).then(function (db) {
        let collection = db.collection(DbClient.teamsColl);

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

router.post("/teamsInfo", function (req, res, next) {
    req.checkBody('team_ids', 'request for team_ids').notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }

    if (Array.isArray(req.body.team_ids)) {
        let team_ids = req.body.team_ids as Array<string>;
        let teams = team_ids.map(v => {
            return new mongodb.ObjectID(v);
        });

        TeamController.findTeamsInfo(teams).then(teams => {
            res.status(200).json(new apiUtils.ApiResponse(true, null, teams));
        }).catch(err => {
            console.error('/teamsInfo: ', err);
            res.status(500).json(new apiUtils.ApiResponse(false, err));
        });
    }
    else {
        res.status(500).json(new apiUtils.ApiResponse(false, "request for array of team id"));
    }
});

router.post('/create', (req, res, next) => {
    req.checkBody('team_name', 'request for team_name').notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }

    let team_name = req.body.team_name as string;
    let user = req["decoded"];

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
    })
});

router.get("/teamMembers", function (req, res, next) {
    req.checkQuery("id", "request for team_id").isMongoId();

    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json(new apiUtils.ApiResponse(false, errors));
    }

    let team_id = new ObjectID(req.query.id);

    async function findTeamMembers(team_id: mongodb.ObjectID) {
        let db = await MongoClient.connect(config.chatDB);
        let collection = db.collection(DbClient.systemUsersColl);

        let results = await collection.find({}).project({ username: 1, firstname: 1, lastname: 1, image: 1 }).limit(100).toArray();

        db.close();
        return results;
    }

    findTeamMembers(team_id).then(docs => {
        res.status(200).json(new apiUtils.ApiResponse(true, null, docs));
    }).catch(err => {
        console.error("findTeamMembers failt", err);
        res.status(500).json(new apiUtils.ApiResponse(false, err));
    });
});

module.exports = router;
