"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const mongodb = require("mongodb");
const async = require("async");
const assert = require("assert");
const config_1 = require("../../../config");
const Room = require("../../models/Room");
const RoomAccessData_1 = require("../../models/RoomAccessData");
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
const config = config_1.getConfig();
;
function joinTeam(team, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield MongoClient.connect(config.chatDB);
        let collection = db.collection(config_1.DbClient.systemUsersColl);
        let result = yield collection.updateOne({ _id: new mongodb.ObjectID(user_id) }, { $addToSet: { teams: team._id.toString() } }, { upsert: false });
        db.close();
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
        let db = yield MongoClient.connect(config.chatDB);
        let userColl = db.collection(config_1.DbClient.chatUserColl);
        let docs = yield userColl.find({ _id: new ObjectID(uid) }).project({ roomAccess: 1 }).limit(1).toArray();
        db.close();
        return docs;
    });
}
exports.getRoomAccessForUser = getRoomAccessForUser;
exports.getRoomAccessOfRoom = (uid, rid) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(config.chatDB).then(db => {
            // Get the documents collection
            let collection = db.collection(config_1.DbClient.chatUserColl);
            collection.find({ _id: new ObjectID(uid) }).project({ roomAccess: { $elemMatch: { roomId: rid } } })
                .limit(1).toArray().then(docs => {
                db.close();
                resolve(docs);
            })
                .catch(err => {
                db.close();
                reject(err);
            });
        }).catch(err => {
            console.error("Cannot connect database", err);
            reject(err);
        });
    });
};
exports.updateLastAccessTimeOfRoom = (uid, rid, date, callback) => {
    async.waterfall([function (cb) {
            MongoClient.connect(config.chatDB).then(db => {
                let collection = db.collection(config_1.DbClient.chatUserColl);
                collection.find({ _id: new ObjectID(uid) }).limit(1).project({ roomAccess: 1 }).toArray().then(docs => {
                    cb(null, docs[0]);
                    db.close();
                }).catch(error => {
                    cb(new Error("cannot find roomAccess info of target uid."), null);
                    db.close();
                });
            }).catch(err => {
                console.error("Cannot connect database", err);
            });
        },
        function (arg, cb) {
            if (arg && arg.roomAccess) {
                findRoomAccessDataMatchWithRoomId(uid, rid, date, cb);
            }
            else {
                //<!-- insert roomAccess info field in user data collection.
                insertRoomAccessInfoField(uid, rid, cb);
            }
        }], function done(err, result) {
        callback(err, result);
    });
};
const onInsertRoomAccessInfoDone = function (uid, rid, callback) {
    MongoClient.connect(Mdb.DbController.chatDB).then(db => {
        let collection = db.collection(Mdb.DbController.userColl);
        collection.find({ _id: new ObjectID(uid) }).project({ roomAccess: 1 }).limit(1).toArray().then(docs => {
            console.log("find roomAccessInfo of uid %s", uid, docs[0]);
            collection.updateOne({ _id: new ObjectID(docs[0]._id), "roomAccess.roomId": rid }, { $set: { "roomAccess.$.accessTime": new Date() } }, { w: 1 }).then(result => {
                console.log("updated roomAccess.accessTime: ", result.result);
                db.close();
                callback(null, result);
            }).catch(err => {
                db.close();
                callback(new Error("cannot update roomAccess.accessTime."), null);
            });
        }).catch(err => {
            db.close();
            callback(new Error("cannot find roomAccess info of target uid."), null);
        });
    }).catch(err => {
        console.error("Cannot connect database", err);
    });
};
exports.AddRoomIdToRoomAccessField = (roomId, memberIds, date, callback) => {
    async.each(memberIds, function (element, cb) {
        AddRidToRoomAccessField(element, roomId, date, (error, response) => {
            cb();
        });
    }, function (errCb) {
        if (!errCb) {
            callback(null, true);
        }
    });
};
exports.AddRoomIdToRoomAccessFieldForUser = (roomId, userId, date) => __awaiter(this, void 0, void 0, function* () {
    let db = yield MongoClient.connect(config.chatDB);
    let chatUserCollection = db.collection(config_1.DbClient.chatUserColl);
    let docs = yield chatUserCollection.find({ _id: new ObjectID(userId) }, { roomAccess: 1 }).limit(1).toArray();
    if (docs.length > 0 && !!docs[0].roomAccess) {
        //<!-- add rid to MembersFields.
        let result = yield findRoomAccessDataMatchWithRoomId(userId, roomId, date);
        db.close();
        return result.result;
    }
    else {
        db.close();
        let result = yield InsertMembersFieldsToUserModel(userId, roomId, date);
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
        MongoClient.connect(config.chatDB).then(function (db) {
            // Get the documents collection
            let user = db.collection(config_1.DbClient.chatUserColl);
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
        MongoClient.connect(config.chatDB).then(db => {
            // Get the documents collection
            let user = db.collection(config_1.DbClient.chatUserColl);
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
    newRoomAccessInfos[0] = new RoomAccessData_1.default();
    newRoomAccessInfos[0].roomId = roomId;
    newRoomAccessInfos[0].accessTime = date;
    let db = yield MongoClient.connect(config.chatDB);
    let chatUserColl = db.collection(config_1.DbClient.chatUserColl);
    let result = yield chatUserColl.updateOne({ _id: new ObjectID(uid) }, { $set: { roomAccess: newRoomAccessInfos } }, { upsert: true });
    db.close();
    return result.result;
});
const findRoomAccessDataMatchWithRoomId = (uid, rid, date) => __awaiter(this, void 0, void 0, function* () {
    if (rid === null) {
        console.warn("rid is invalid: careful for use this func: ", rid);
    }
    let db = yield MongoClient.connect(config.chatDB);
    let collection = db.collection(config_1.DbClient.chatUserColl);
    // Peform a simple find and return all the documents
    let docs = yield collection.find({ _id: new ObjectID(uid) }).project({ roomAccess: { $elemMatch: { roomId: rid.toString() } } }).toArray();
    let printR = (docs) ? docs : null;
    console.log("find roomAccessInfo of uid: %s match with rid: %s :: ", uid, rid, printR);
    if (!docs || !docs[0].roomAccess) {
        //<!-- Push new roomAccess data. 
        let newRoomAccessInfo = new RoomAccessData_1.default();
        newRoomAccessInfo.roomId = rid.toString();
        newRoomAccessInfo.accessTime = date;
        let result = yield collection.updateOne({ _id: new ObjectID(uid) }, { $push: { roomAccess: newRoomAccessInfo } }, { w: 1 });
        db.close();
        console.log("Push new roomAccess.: ", result.result);
        return result;
    }
    else {
        //<!-- Update if data exist.
        let result = yield collection.updateOne({ _id: new ObjectID(uid), "roomAccess.roomId": rid }, { $set: { "roomAccess.$.accessTime": date } }, { w: 1 });
        db.close();
        console.log("Updated roomAccess.accessTime: ", result.result);
        return result;
    }
});
const insertRoomAccessInfoField = function (uid, rid, callback) {
    let newRoomAccessInfos = new Array();
    newRoomAccessInfos[0] = new RoomAccessData_1.default();
    newRoomAccessInfos[0].roomId = rid;
    newRoomAccessInfos[0].accessTime = new Date();
    MongoClient.connect(Mdb.DbController.chatDB).then(db => {
        // Get a collection
        let collection = db.collection(Mdb.DbController.userColl);
        collection.updateOne({ _id: new ObjectID(uid) }, { $set: { roomAccess: newRoomAccessInfos } }, { upsert: true, w: 1 }).then(result => {
            console.log("Upsert roomAccess array field.", result.result);
            UserManager.getInstance().onInsertRoomAccessInfoDone(uid, rid, callback);
            db.close();
        }).catch(err => {
            db.close();
        });
    }).catch(err => {
        console.error("Cannot connect database", err);
    });
};
exports.getUserProfile = (query, projection, callback) => {
    MongoClient.connect(config.chatDB).then(db => {
        // Get the documents collection
        let collection = db.collection(config_1.DbClient.chatUserColl);
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
    MongoClient.connect(config.chatDB).then(db => {
        // Get the documents collection
        let collection = db.collection(config_1.DbClient.chatUserColl);
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
    MongoClient.connect(config.chatDB).then(db => {
        // Get the documents collection
        let collection = db.collection(config_1.DbClient.chatUserColl);
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
        assert.equal(null, err);
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
        assert.equal(null, err);
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
        assert.equal(null, err);
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
        assert.equal(null, err);
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
        assert.equal(null, err);
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
        assert.equal(null, err);
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
        assert.equal(null, err);
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
