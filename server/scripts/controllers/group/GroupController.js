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
const DbClient_1 = require("../../DbClient");
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
function createDefaultGroup(owner) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield MongoClient.connect(config_1.Config.chatDB);
        let collection = db.collection(config_1.DbClient.chatroomColl);
        let member = {};
        member._id = owner._id;
        member.joinTime = new Date();
        member.room_role = Room_1.MemberRole.owner;
        member.username = owner.username;
        let group = new Room_1.Room();
        group.createTime = new Date();
        group.description = "Default group";
        group.members = [member];
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
        let db = yield MongoClient.connect(config_1.Config.chatDB);
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
function getOrgGroups(team_id, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = DbClient_1.getAppDb();
        let collection = db.collection(config_1.DbClient.chatroomColl);
        collection.createIndex({ team_id: 1 }, { background: true });
        let docs = yield collection.find({
            team_id: team_id,
            "members._id": { $in: [user_id] },
            type: Room_1.RoomType.organizationGroup
        }).toArray();
        return docs;
    });
}
exports.getOrgGroups = getOrgGroups;
function addMember(group_id, user) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield MongoClient.connect(config_1.Config.chatDB);
        let collection = db.collection(config_1.DbClient.chatroomColl);
        let member = {};
        member._id = user._id;
        member.joinTime = new Date();
        member.room_role = Room_1.MemberRole.member;
        member.username = user.username;
        let results = yield collection.update({ _id: new mongodb.ObjectID(group_id) }, { $addToSet: { members: member } }, { upsert: false });
        db.close();
        return results.result;
    });
}
exports.addMember = addMember;
function removeUserOutOfOrgChartGroups(user_id, orgChart_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield MongoClient.connect(config_1.Config.chatDB);
        let groupCollection = db.collection(config_1.DbClient.chatroomColl);
        let results = yield groupCollection.updateMany({ org_chart_id: orgChart_id }, { $pull: { members: { $elemMatch: { _id: user_id } } } }, { upsert: false });
        db.close();
        return results.result;
    });
}
exports.removeUserOutOfOrgChartGroups = removeUserOutOfOrgChartGroups;
function addUserToOrgChartGroups(user_id, username, orgChart_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield MongoClient.connect(config_1.Config.chatDB);
        let groupCollection = db.collection(config_1.DbClient.chatroomColl);
        let member = {};
        member._id = user_id;
        member.joinTime = new Date();
        member.room_role = Room_1.MemberRole.member;
        member.username = username;
        let results = yield groupCollection.updateMany({ org_chart_id: orgChart_id }, { $addToSet: { members: member } }, { upsert: false });
        db.close();
        return results.result;
    });
}
exports.addUserToOrgChartGroups = addUserToOrgChartGroups;
