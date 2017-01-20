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
const config = config_1.getConfig();
function findTeamsInfo(team_ids) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield MongoClient.connect(config.chatDB);
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
        let db = yield MongoClient.connect(config.chatDB);
        let collection = db.collection(config_1.DbClient.teamsColl);
        collection.createIndex({ name: 1 }, { background: true });
        let teams = yield collection.find({ name: _team }).limit(1).toArray();
        db.close();
        return teams;
    });
}
exports.findTeamName = findTeamName;
function createTeam(team_name) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield MongoClient.connect(config.chatDB);
        let collection = db.collection(config_1.DbClient.teamsColl);
        collection.createIndex({ name: 1 }, { background: true });
        let team = {};
        team.name = team_name.toLowerCase();
        team.createAt = new Date();
        let result = yield collection.insert(team);
        db.close();
        return result.ops;
    });
}
exports.createTeam = createTeam;
