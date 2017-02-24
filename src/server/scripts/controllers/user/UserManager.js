"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb = require("mongodb");
const async = require("async");
const Room = require("../../models/Room");
const Stalk_1 = require("../../models/Stalk");
const config_1 = require("../../../config");
const DbClient_1 = require("../../DbClient");
const { ObjectID } = mongodb;
;
function joinTeam(team, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = DbClient_1.getAppDb();
        let collection = db.collection(config_1.DbClient.chitchatUserColl);
        let result = yield collection.updateOne({ _id: new mongodb.ObjectID(user_id) }, { $addToSet: { teams: team._id.toString() } }, { upsert: false });
        return result;
    });
}
exports.joinTeam = joinTeam;
exports.getLastProfileChanged = (uid, callback) => {
};
exports.updateImageProfile = (uid, newUrl, callback) => {
};
function getRoomAccessForUser(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = DbClient_1.getAppDb();
        let userColl = db.collection(config_1.DbClient.stalkUserColl);
        let docs = yield userColl.find({ _id: new ObjectID(uid) }).project({ roomAccess: 1 }).limit(1).toArray();
        return docs;
    });
}
exports.getRoomAccessForUser = getRoomAccessForUser;
exports.getRoomAccessOfRoom = (uid, rid) => __awaiter(this, void 0, void 0, function* () {
    let db = DbClient_1.getAppDb();
    let collection = db.collection(config_1.DbClient.stalkUserColl);
    let docs = yield collection.find({ _id: new ObjectID(uid) })
        .project({ roomAccess: { $elemMatch: { roomId: rid } } })
        .limit(1).toArray();
    return docs;
});
function AddRoomIdToRoomAccessFieldOfUsers(roomId, memberIds, date) {
    return __awaiter(this, void 0, void 0, function* () {
        let isDone = false;
        yield new Promise((resolve, reject) => {
            async.each(memberIds, function (element, cb) {
                AddRoomIdToRoomAccessFieldOfUser(roomId, element, date).then(result => {
                    cb();
                }).catch(err => {
                    cb();
                });
            }, function (errCb) {
                isDone = true;
                resolve(isDone);
            });
        });
        return isDone;
    });
}
exports.AddRoomIdToRoomAccessFieldOfUsers = AddRoomIdToRoomAccessFieldOfUsers;
function AddRoomIdToRoomAccessFieldOfUser(roomId, userId, date) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = DbClient_1.getAppDb();
        let chatUserCollection = db.collection(config_1.DbClient.stalkUserColl);
        let docs = yield chatUserCollection.find({ _id: new ObjectID(userId) }, { roomAccess: 1 }).limit(1).toArray();
        if (docs.length > 0 && !!docs[0].roomAccess) {
            // <!-- add rid to MembersFields.
            let result = yield findRoomAccessDataMatchWithRoomId(userId, roomId, date);
            return result;
        }
        else {
            let result = yield InsertMembersFieldsToUserModel(userId, roomId, date);
            return result;
        }
    });
}
exports.AddRoomIdToRoomAccessFieldOfUser = AddRoomIdToRoomAccessFieldOfUser;
exports.updateLastAccessTimeOfRoom = (user_id, room_id, date) => __awaiter(this, void 0, void 0, function* () {
    let db = DbClient_1.getAppDb();
    let stalkUsersColl = db.collection(config_1.DbClient.stalkUserColl);
    let docs = yield stalkUsersColl.find({ _id: new ObjectID(user_id) }).limit(1)
        .project({ roomAccess: 1 }).toArray();
    if (docs.length > 0 && docs[0].roomAccess) {
        let result = yield findRoomAccessDataMatchWithRoomId(user_id, room_id, date);
        return result;
    }
    else {
        // <!-- insert roomAccess info field in user data collection.
        let result = yield insertRoomAccessInfoField(user_id, room_id);
        return result;
    }
});
exports.updateFavoriteMembers = (editType, member, uid, callback) => {
    if (editType === "add") {
        this.userDataAccess.addFavoriteMembers(member, uid, callback);
    }
    else if (editType === "remove") {
        this.userDataAccess.removeFavoriteMembers(member, uid, callback);
    }
};
exports.updateFavoriteGroups = (editType, group, uid, callback) => {
    if (editType === "add") {
        this.userDataAccess.addFavoriteGroup(group, uid, callback);
    }
    else if (editType === "remove") {
        this.userDataAccess.removeFavoriteGroup(group, uid, callback);
    }
};
exports.updateClosedNoticeUsersList = (editType, member, uid, callback) => {
    if (editType === "add") {
        this.userDataAccess.addClosedNoticeUsersList(member, uid, callback);
    }
    else if (editType === "remove") {
        this.userDataAccess.removeClosedNoticeUsersList(member, uid, callback);
    }
};
exports.updateClosedNoticeGroups = (editType, group, uid, callback) => {
    if (editType === "add") {
        this.userDataAccess.addClosedNoticeGroupList(group, uid, callback);
    }
    else if (editType === "remove") {
        this.userDataAccess.removeClosedNoticeGroupList(group, uid, callback);
    }
};
/**
* Check creator permission for create ProjectBase Group requesting.
* res will return { _id, role } of user model.
*/
exports.getCreatorPermission = (creator, callback) => {
    this.userDataAccess.getRole(creator, (err, res) => {
        //<!-- res will return { _id, role } of user model.
        if (err || res === null) {
            callback(err, null);
        }
        else {
            callback(null, res);
        }
    });
};
exports.checkUnsubscribeRoom = (userId, roomType, roomId, callback) => {
    if (roomType === Room.RoomType.privateGroup) {
        MongoClient.connect(config_1.Config.chatDB).then(function (db) {
            // Get the documents collection
            let user = db.collection(config_1.DbClient.stalkUserColl);
            user.find({ _id: new ObjectID(userId), closedNoticeGroups: roomId }).limit(1).toArray(function (err, results) {
                if (err || results === null) {
                    callback(err, null);
                }
                else {
                    callback(null, results);
                }
                db.close();
            });
        });
    }
    else if (roomType === Room.RoomType.privateChat) {
        MongoClient.connect(config_1.Config.chatDB).then(db => {
            // Get the documents collection
            let user = db.collection(config_1.DbClient.stalkUserColl);
            user.find({ _id: new ObjectID(userId), closedNoticeUsers: roomId }).limit(1).toArray((err, docs) => {
                if (err || docs === null) {
                    callback(err, null);
                }
                else {
                    callback(null, docs);
                }
                db.close();
            });
        });
    }
};
const InsertMembersFieldsToUserModel = (uid, roomId, date) => __awaiter(this, void 0, void 0, function* () {
    let newRoomAccessInfos = new Array();
    newRoomAccessInfos[0] = new Stalk_1.RoomAccessData();
    newRoomAccessInfos[0].roomId = roomId;
    newRoomAccessInfos[0].accessTime = date;
    let db = DbClient_1.getAppDb();
    let chatUserColl = db.collection(config_1.DbClient.stalkUserColl);
    let result = yield chatUserColl.updateOne({ _id: new ObjectID(uid) }, { $set: { roomAccess: newRoomAccessInfos } }, { upsert: true });
    return result.result;
});
const insertRoomAccessInfoField = (user_id, room_id) => __awaiter(this, void 0, void 0, function* () {
    let newRoomAccessInfos = new Array();
    newRoomAccessInfos[0] = new Stalk_1.RoomAccessData();
    newRoomAccessInfos[0].roomId = room_id;
    newRoomAccessInfos[0].accessTime = new Date();
    let db = DbClient_1.getAppDb();
    let chatUserCollection = db.collection(config_1.DbClient.stalkUserColl);
    let result = yield chatUserCollection.updateOne({ _id: new ObjectID(user_id) }, { $set: { roomAccess: newRoomAccessInfos } }, { upsert: true, w: 1 });
    return result.result;
});
const findRoomAccessDataMatchWithRoomId = (uid, rid, date) => __awaiter(this, void 0, void 0, function* () {
    let db = DbClient_1.getAppDb();
    let chatUserColl = db.collection(config_1.DbClient.stalkUserColl);
    // Peform a simple find and return all the documents
    let docs = yield chatUserColl.find({ _id: new ObjectID(uid) })
        .project({ roomAccess: { $elemMatch: { roomId: rid.toString() } } })
        .toArray();
    if (!docs || !docs[0].roomAccess) {
        //<!-- Push new roomAccess data. 
        let newRoomAccessInfo = new Stalk_1.RoomAccessData();
        newRoomAccessInfo.roomId = rid.toString();
        newRoomAccessInfo.accessTime = date;
        let result = yield chatUserColl.updateOne({ _id: new ObjectID(uid) }, { $push: { roomAccess: newRoomAccessInfo } }, { w: 1 });
        console.log("Push new roomAccess.: ", result.result);
        return result.result;
    }
    else {
        //<!-- Update if data exist.
        let result = yield chatUserColl.updateOne({ _id: new ObjectID(uid), "roomAccess.roomId": rid }, { $set: { "roomAccess.$.accessTime": date } }, { w: 1 });
        console.log("Updated roomAccess.accessTime: ", result.result);
        return result.result;
    }
});
exports.getUserProfile = (query, projection, callback) => {
    MongoClient.connect(config_1.Config.chatDB).then(db => {
        // Get the documents collection
        let collection = db.collection(config_1.DbClient.stalkUserColl);
        // Find some documents
        collection.find(query).project(projection).limit(1).toArray((err, results) => {
            if (err) {
                callback(err, null);
            }
            else {
                callback(null, results);
            }
            db.close();
        });
    }).catch(err => {
        console.error("Cannot connect database", err);
        callback(err, null);
    });
};
exports.getRole = (creator, callback) => {
    MongoClient.connect(config_1.Config.chatDB).then(db => {
        // Get the documents collection
        let collection = db.collection(config_1.DbClient.stalkUserColl);
        // Find some documents
        collection.find({ _id: new ObjectID(creator) }).project({ role: 1 }).limit(1).toArray((err, results) => {
            if (err || results === null) {
                callback(err, null);
            }
            else {
                callback(null, results);
            }
            db.close();
        });
    }).catch(err => {
        console.warn("getRole", err);
    });
};
exports.addFavoriteMembers = (member, uid, callback) => {
    MongoClient.connect(config_1.Config.chatDB).then(db => {
        // Get the documents collection
        let collection = db.collection(config_1.DbClient.stalkUserColl);
        collection.updateOne({ _id: new ObjectID(uid) }, { $addToSet: { favoriteUsers: member } }, { upsert: true }, (err, result) => {
            if (err || result === null) {
                callback(err, null);
            }
            else {
                callback(null, result);
            }
            db.close();
        });
    }).catch(err => {
        console.warn("addFavoriteMembers fail", err);
    });
};
exports.removeFavoriteMembers = (member, uid, callback) => {
    MongoClient.connect(Mdb.DbController.chatDB, (err, db) => {
        if (err) {
            return console.dir(err);
        }
        // Get the documents collection
        var collection = db.collection(Mdb.DbController.userColl);
        // Find some documents
        collection.updateOne({ _id: new ObjectID(uid) }, { $pull: { favoriteUsers: member } }, (err, result) => {
            if (err || result === null) {
                callback(err, null);
            }
            else {
                callback(null, result);
            }
            db.close();
        });
    });
};
exports.addFavoriteGroup = (group, uid, callback) => {
    MongoClient.connect(Mdb.DbController.chatDB, (err, db) => {
        if (err) {
            return console.dir(err);
        }
        // Get the documents collection
        var collection = db.collection(Mdb.DbController.userColl);
        collection.updateOne({ _id: new ObjectID(uid) }, { $addToSet: { favoriteGroups: group } }, { upsert: true }, (err, result) => {
            if (err || result === null) {
                callback(err, null);
            }
            else {
                callback(null, result);
            }
            db.close();
        });
    });
};
exports.removeFavoriteGroup = (group, uid, callback) => {
    MongoClient.connect(Mdb.DbController.chatDB, (err, db) => {
        if (err) {
            return console.dir(err);
        }
        // Get the documents collection
        var collection = db.collection(Mdb.DbController.userColl);
        // Find some documents
        collection.updateOne({ _id: new ObjectID(uid) }, { $pull: { favoriteGroups: group } }, (err, result) => {
            if (err || result === null) {
                callback(err, null);
            }
            else {
                callback(null, result);
            }
            db.close();
        });
    });
};
exports.addClosedNoticeUsersList = (member, uid, callback) => {
    MongoClient.connect(Mdb.DbController.chatDB, (err, db) => {
        if (err) {
            return console.dir(err);
        }
        // Get the documents collection
        var collection = db.collection(Mdb.DbController.userColl);
        collection.updateOne({ _id: new ObjectID(uid) }, { $addToSet: { closedNoticeUsers: member } }, { upsert: true }, (err, result) => {
            if (err || result === null) {
                callback(err, null);
            }
            else {
                callback(null, result);
            }
            db.close();
        });
    });
};
exports.removeClosedNoticeUsersList = (member, uid, callback) => {
    MongoClient.connect(Mdb.DbController.chatDB, (err, db) => {
        if (err) {
            return console.dir(err);
        }
        // Get the documents collection
        var collection = db.collection(Mdb.DbController.userColl);
        // Find some documents
        collection.updateOne({ _id: new ObjectID(uid) }, { $pull: { closedNoticeUsers: member } }, (err, result) => {
            if (err || result === null) {
                callback(err, null);
            }
            else {
                callback(null, result);
            }
            db.close();
        });
    });
};
exports.addClosedNoticeGroupList = (member, uid, callback) => {
    MongoClient.connect(Mdb.DbController.chatDB, (err, db) => {
        if (err) {
            return console.dir(err);
        }
        // Get the documents collection
        var collection = db.collection(Mdb.DbController.userColl);
        collection.updateOne({ _id: new ObjectID(uid) }, { $addToSet: { closedNoticeGroups: member } }, { upsert: true }, (err, result) => {
            if (err || result === null) {
                callback(err, null);
            }
            else {
                callback(null, result);
            }
            db.close();
        });
    });
};
exports.removeClosedNoticeGroupList = (member, uid, callback) => {
    MongoClient.connect(Mdb.DbController.chatDB, (err, db) => {
        if (err) {
            return console.dir(err);
        }
        // Get the documents collection
        var collection = db.collection(Mdb.DbController.userColl);
        // Find some documents
        collection.updateOne({ _id: new ObjectID(uid) }, { $pull: { closedNoticeGroups: member } }, (err, result) => {
            if (err || result === null) {
                callback(err, null);
            }
            else {
                callback(null, result);
            }
            db.close();
        });
    });
};
function updateOrgChart(user_id, team_id, org_chart_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = DbClient_1.getAppDb();
        let teamProfileColl = db.collection(config_1.DbClient.teamProfileCollection);
        yield teamProfileColl.createIndex({ team_id: 1, user_id: 1 }, { background: true });
        let profile = {};
        profile.team_id = new mongodb.ObjectID(team_id);
        profile.user_id = new mongodb.ObjectID(user_id);
        profile.org_chart_id = new mongodb.ObjectID(org_chart_id);
        let result = yield teamProfileColl.updateOne({ user_id: profile.user_id, team_id: profile.team_id }, { $set: { org_chart_id: profile.org_chart_id } }, { upsert: true });
        return result.result;
    });
}
exports.updateOrgChart = updateOrgChart;
function getUserOrgChart(user_id, team_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = DbClient_1.getAppDb();
        let teamProfileColl = db.collection(config_1.DbClient.teamProfileCollection);
        yield teamProfileColl.createIndex({ team_id: 1, user_id: 1 }, { background: true });
        let profile = {};
        profile.team_id = new mongodb.ObjectID(team_id);
        profile.user_id = new mongodb.ObjectID(user_id);
        let docs = yield teamProfileColl.find({ user_id: profile.user_id, team_id: profile.team_id })
            .project({ org_chart_id: 1 }).limit(1).toArray();
        return docs;
    });
}
exports.getUserOrgChart = getUserOrgChart;
function getTeamProfile(user_id, team_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = DbClient_1.getAppDb();
        let teamProfileColl = db.collection(config_1.DbClient.teamProfileCollection);
        let profile = {};
        profile.team_id = new mongodb.ObjectID(team_id);
        profile.user_id = new mongodb.ObjectID(user_id);
        let docs = yield teamProfileColl.find({ user_id: profile.user_id, team_id: profile.team_id }).limit(1).toArray();
        return docs;
    });
}
exports.getTeamProfile = getTeamProfile;
