"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const config_1 = require("../../../config");
const GroupController = require("../group/GroupController");
function findTeamsInfo(team_ids) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield MongoClient.connect(config_1.Config.chatDB);
        let collection = db.collection(config_1.DbClient.teamsColl);
        let teams = yield collection.find({ _id: { $in: team_ids } }).limit(10).toArray();
        db.close();
        return teams;
    });
}
exports.findTeamsInfo = findTeamsInfo;
function findTeamName(team_name) {
    return __awaiter(this, void 0, void 0, function* () {
        let _team = team_name.toLowerCase();
        let db = yield MongoClient.connect(config_1.Config.chatDB);
        let collection = db.collection(config_1.DbClient.teamsColl);
        collection.createIndex({ name: 1 }, { background: true });
        let teams = yield collection.find({ name: _team }).limit(1).toArray();
        db.close();
        return teams;
    });
}
exports.findTeamName = findTeamName;
function searchTeam(team_name) {
    return __awaiter(this, void 0, void 0, function* () {
        let _team = team_name.toLowerCase();
        let db = yield MongoClient.connect(config_1.Config.chatDB);
        let collection = db.collection(config_1.DbClient.teamsColl);
        collection.createIndex({ name: 1 }, { background: true });
        let _key = new RegExp("^" + _team);
        let teams = yield collection.find({ name: { $regex: _key, $options: "i" } }).limit(100).toArray();
        db.close();
        return teams;
    });
}
exports.searchTeam = searchTeam;
function createTeam(team_name, owner) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield MongoClient.connect(config_1.Config.chatDB);
        let collection = db.collection(config_1.DbClient.teamsColl);
        collection.createIndex({ name: 1 }, { background: true });
        let defaultGroup = yield GroupController.createDefaultGroup(owner);
        let _group = defaultGroup[0];
        let team = {};
        team.name = team_name.toLowerCase();
        team.createAt = new Date();
        team.defaultGroup = _group;
        team.groups = new Array(_group._id.toString());
        let result = yield collection.insert(team);
        let newTeam = result.ops;
        if (newTeam.length > 0) {
            GroupController.addTeamToGroup(_group, newTeam[0]);
        }
        db.close();
        return result.ops;
    });
}
exports.createTeam = createTeam;
