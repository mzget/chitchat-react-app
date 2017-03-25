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
const apiUtils = require("../scripts/utils/apiUtils");
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
const router = express.Router();
const config_1 = require("../config");
const DbClient_1 = require("../scripts/DbClient");
const TeamController = require("../scripts/controllers/team/TeamController");
const UserManager = require("../scripts/controllers/user/UserManager");
const GroupController = require("../scripts/controllers/group/GroupController");
router.get("/", (req, res, next) => {
    req.checkQuery("name", "request for name param").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json(new apiUtils.ApiResponse(false, errors));
    }
    let team_name = req.query.name;
    TeamController.searchTeam(team_name).then(value => {
        if (value.length > 0)
            res.status(200).json(new apiUtils.ApiResponse(true, null, value));
        else
            res.status(500).json(new apiUtils.ApiResponse(false, value));
    }).catch(err => {
        console.error("Find team name fail: ", err);
        res.status(500).json(new apiUtils.ApiResponse(false, err));
    });
});
router.post("/teamInfo", function (req, res, next) {
    req.checkBody("team_id", "request for team_id").isMongoId();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }
    let team_id = new mongodb.ObjectID(req.body.team_id);
    MongoClient.connect(config_1.Config.chatDB).then(function (db) {
        let collection = db.collection(config_1.DbClient.teamsColl);
        collection.createIndex({ name: 1 }, { background: true });
        collection.find({ _id: team_id }).limit(1).toArray().then(function (docs) {
            if (docs.length >= 1) {
                res.status(200).json({ success: true, result: docs[0] });
                db.close();
            }
            else {
                res.status(500).json({ success: false, message: "No have teamInfo" });
                db.close();
            }
        });
    }).catch(err => {
        console.error("/teamInfo: ", err);
        res.status(500).json({ success: false, message: req.url + err });
    });
});
router.post("/teamsInfo", function (req, res, next) {
    req.checkBody("team_ids", "request for team_ids").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }
    if (Array.isArray(req.body.team_ids)) {
        let team_ids = req.body.team_ids;
        let teams = team_ids.map(v => {
            return new mongodb.ObjectID(v);
        });
        TeamController.findTeamsInfo(teams).then(teams => {
            res.status(200).json(new apiUtils.ApiResponse(true, null, teams));
        }).catch(err => {
            console.error("/teamsInfo: ", err);
            res.status(500).json(new apiUtils.ApiResponse(false, err));
        });
    }
    else {
        res.status(500).json(new apiUtils.ApiResponse(false, "request for array of team id"));
    }
});
router.post("/create", (req, res, next) => {
    req.checkBody("team_name", "request for team_name").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }
    let team_name = req.body.team_name;
    let user = req["decoded"];
    // @Find team_name for check it already used.
    TeamController.findTeamName(team_name).then(teams => {
        if (teams.length > 0)
            throw new Error("team name already used.");
        else
            return TeamController.createTeam(team_name, user);
    }).then(result => {
        res.status(200).json(new apiUtils.ApiResponse(true, null, result));
        UserManager.joinTeam(result[0], user._id);
    }).catch((err) => {
        console.error("findTeamName fail: ", err);
        res.status(500).json(new apiUtils.ApiResponse(false, err.message));
    });
});
router.post("/join", (req, res, next) => {
    req.checkBody("name", "request for team name").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json(new apiUtils.ApiResponse(false, errors));
    }
    let name = req.body.name;
    let token = req["decoded"];
    let user_id = token["_id"];
    TeamController.findTeamName(name).then(teams => {
        if (teams.length > 0) {
            let team = teams[0];
            UserManager.joinTeam(team, user_id).then(value => {
                res.status(200).json(new apiUtils.ApiResponse(true, null, value));
                let group_id = team.defaultGroup._id;
                GroupController.addMember(group_id, token).then(value => {
                    console.log("addMember success", value);
                });
            }).catch(err => {
                res.status(500).json(new apiUtils.ApiResponse(false, err));
            });
        }
        else {
            console.error("Cannot find this team name");
            res.status(500).json(new apiUtils.ApiResponse(false, teams));
        }
    }).catch(err => {
        console.error("Cannot find this team name");
        res.status(500).json(new apiUtils.ApiResponse(false, err));
    });
});
router.get("/teamMembers", function (req, res, next) {
    req.checkQuery("id", "request for team_id").isMongoId();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json(new apiUtils.ApiResponse(false, errors));
    }
    let team_id = new ObjectID(req.query.id);
    function findTeamMembers(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = DbClient_1.getAppDb();
            let chitchatUserColl = db.collection(config_1.DbClient.chitchatUserColl);
            let results = yield chitchatUserColl.aggregate([
                { $match: { teams: { $in: [team_id.toString()] } } },
                {
                    $lookup: {
                        from: config_1.DbClient.teamProfileCollection,
                        localField: "_id",
                        foreignField: "user_id",
                        as: "teamProfiles"
                    }
                },
                {
                    $project: { username: 1, firstname: 1, lastname: 1, avatar: 1, teamProfiles: "$teamProfiles" }
                },
                {
                    $redact: {
                        $cond: {
                            if: { $and: [{ $ne: ["$team_id", team_id] }, { $ifNull: ["$team_id", false] }] },
                            then: "$$PRUNE",
                            else: "$$DESCEND"
                        }
                    }
                }
            ]).limit(100).toArray();
            console.log(results);
            return results;
        });
    }
    findTeamMembers(team_id).then(docs => {
        res.status(200).json(new apiUtils.ApiResponse(true, null, docs));
    }).catch(err => {
        console.error("findTeamMembers fail", err);
        res.status(500).json(new apiUtils.ApiResponse(false, err));
    });
});
module.exports = router;
