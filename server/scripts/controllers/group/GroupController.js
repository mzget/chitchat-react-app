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
const config_1 = require("../../../config");
const Room_1 = require("../../models/Room");
const config = config_1.getConfig();
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
function createDefaultGroup() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield MongoClient.connect(config.chatDB);
        let collection = db.collection(config_1.DbClient.chatroomColl);
        let group = new Room_1.Room();
        group.createTime = new Date();
        group.description = "Default group";
        group.members = "*";
        group.name = "General";
        group.status = Room_1.RoomStatus.active;
        group.type = Room_1.RoomType.organizationGroup;
        let result = yield collection.insert(group);
        db.close();
        return result.ops;
    });
}
exports.createDefaultGroup = createDefaultGroup;
function addTeamToGroup(group, team) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield MongoClient.connect(config.chatDB);
        let collection = db.collection(config_1.DbClient.chatroomColl);
        let result = yield collection.update({ _id: new mongodb.ObjectID(group._id) }, {
            $set: {
                team_id: team._id
            }
        });
        db.close();
        return result.ops;
    });
}
exports.addTeamToGroup = addTeamToGroup;
function getOrgGroups(team_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield MongoClient.connect(config.chatDB);
        let collection = db.collection(config_1.DbClient.chatroomColl);
        collection.createIndex({ team_id: 1 }, { background: true });
        let docs = yield collection.find({ team_id: team_id, type: 0 }).toArray();
        db.close();
        return docs;
    });
}
exports.getOrgGroups = getOrgGroups;
