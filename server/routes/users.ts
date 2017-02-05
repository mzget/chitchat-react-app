import express = require("express");
import mongodb = require("mongodb");

import * as apiUtils from "../scripts/utils/apiUtils";

import * as TeamController from "../scripts/controllers/team/TeamController";
import * as UserManager from "../scripts/controllers/user/UserManager";
import * as GroupController from "../scripts/controllers/group/GroupController";
const router = express.Router();
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

import { ChitChatAccount } from "../scripts/models/User";
import { getConfig, DbClient } from "../config";
const config = getConfig();

/* GET users listing. */
router.get("/contact/", function (req, res, next) {
    req.checkQuery("email", "Request for email as query param.").optional();
    req.checkQuery("id", "Request for id as query param").optional();

    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }

    let query = req.query;
    if (query.email) {
        let email = query.email.toLowerCase();

        MongoClient.connect(config.appDB).then(db => {
            let collection = db.collection(DbClient.userContactColl);

            collection.find({ email: email }).project({ password: 0 }).limit(1).toArray().then(function (docs) {
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
    }
    else if (query.id) {
        let user_id: mongodb.ObjectID = null;
        try {
            user_id = new mongodb.ObjectID(query.id);
        }
        catch (err) {
            res.status(500).json({ success: false, message: "id is require for ObjectID." });
            return;
        }

        MongoClient.connect(config.appDB).then(function (db) {
            let collection = db.collection(DbClient.userContactColl);

            collection.find({ _id: user_id }).project({ password: 0 })
                .limit(1).toArray().then(function (docs) {
                    if (docs.length >= 1) {
                        db.close();
                        res.status(200).json({ success: true, result: docs });
                    }
                    else {
                        res.status(500).json({ success: false, message: "no user data." });
                        db.close();
                    }
                }).catch(error => {
                    res.status(500).json({ success: false, message: "db accesss fail.", error: error });
                    db.close();
                });
        }).catch(err => {
            res.status(500).send({ success: false, message: "Cannot connect mongodb " + err });
        });
    }
    else {
        res.status(500).json({ success: false, message: "missing query string" });
    }
});

router.get("/", (req, res, next) => {
    req.checkQuery("username", "Request for id as param").notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }

    MongoClient.connect(config.chatDB).then(db => {
        let collection = db.collection(DbClient.chitchatUserColl);

        collection.find({ username: req.query.username }).project({ password: 0 }).limit(1).toArray().then(function (docs) {
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
        res.status(500).json({ success: false, message: err + ": Cannot connect db." });
    });
});

router.post("/signup", function (req: express.Request, res: express.Response, next) {
    req.checkBody("user", "request for user object").notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }

    let user = req.body.user;

    let userModel = new ChitChatAccount();
    userModel.displayname = user.username;
    userModel.username = user.email;
    userModel.email = user.email;
    userModel.password = user.password;
    userModel.firstname = user.firstname;
    userModel.lastname = user.lastname;
    userModel.tel = user.tel;
    userModel.teams = new Array();

    MongoClient.connect(config.chatDB).then(function (db) {
        let collection = db.collection(DbClient.chitchatUserColl);

        collection.createIndex({ email: 1 }, { background: true });

        collection.find({ email: user.email }).limit(1).toArray().then(function (docs) {
            if (docs.length >= 1) {
                res.status(500).json({ success: false, message: "Account registed with your email is already used." });
                db.close();
            }
            else {
                collection.insertOne(userModel).then(function onFulfilled(value) {
                    res.status(200).json({ success: true, result: value.ops });
                    db.close();
                }).catch(function onRejected(error) {
                    res.status(500).json({ success: false, message: error });
                    db.close();
                });
            }
        }).catch(err => {
            db.close();
            res.status(500).json({ success: false, message: err });
        });
    }).catch(err => {
        console.error("Cannot connect db: ", err);
        res.status(500).json({ success: false, message: err });
    });
});

/*
router.get("/teams", (req, res, next) => {
    req.checkQuery("user_id", "request for user_id").isMongoId();

    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json(new apiUtils.ApiResponse(false, errors));
    }

    let user_id = new mongodb.ObjectID(req.query.user_id);

    async function findUserTeams() {
        let db = await MongoClient.connect(config.chatDB);
        let collection = db.collection(DbClient.systemUsersColl);

        let user = await collection.find({ _id: user_id }).project({ teams: 1 }).limit(1).toArray();
        db.close();
        return user[0];
    }

    findUserTeams().then((user: ChitChatAccount) =>
        TeamController.findTeamsInfo(user.teams)
    ).then(teams => {
        res.status(200).json(new apiUtils.ApiResponse(true, null, teams));
    }).catch(err => {
        res.status(500).json(new apiUtils.ApiResponse(false, err));
    });
});
*/


router.post("/setOrgChartId", (req, res, next) => {
    req.checkBody("user", "request for user object as body params").notEmpty();
    req.checkBody("team_id", "request for team_id").isMongoId();
    req.checkBody("org_chart_id", "request for org_chart_id").isMongoId();

    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json(new apiUtils.ApiResponse(false, errors));
    }

    // @todo..
    // find old org_chart.
    // remove user out of members list from all group of old org_chart.
    // add user to member of all group of new org_chart.
    let user = req.body.user as ChitChatAccount;
    let team_id = req.body.team_id as string;
    let org_chart_id = req.body.org_chart_id as string;

    async function setOrgChartId() {
        let docs = await UserManager.getUserOrgChart(user._id.toString(), team_id);

        if (docs.length > 0 && !!docs[0].org_chart_id) {
            let old_org_chart_id = docs[0].org_chart_id;

            let removeResult = await GroupController.removeUserOutOfOrgChartGroups(user._id.toString(), old_org_chart_id.toString());
        }

        let addResult = await GroupController.addUserToOrgChartGroups(user, org_chart_id.toString());
        let result = await UserManager.updateOrgChart(user._id.toString(), team_id, org_chart_id);

        return result;
    }

    setOrgChartId().then(result => {
        res.status(200).json(new apiUtils.ApiResponse(false, null, result));
    }).catch(err => {
        console.error("Fail to updateOrgChart", err);
        res.status(500).json(new apiUtils.ApiResponse(false, err));
    });
});

module.exports = router;
