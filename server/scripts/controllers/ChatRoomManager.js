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
const async = require("async");
const Room = require("../models/Room");
const UserManager = require("./user/UserManager");
const ObjectID = mongodb.ObjectID;
const MongoClient = mongodb.MongoClient;
const config_1 = require("../../config");
const config = config_1.getConfig();
/*
* Require
*@roomId for query chat record in room.
*@lastAccessTime for query only message who newer than lastAccessTime.
*/
function getNewerMessageOfChatRoom(roomId, isoDate) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield MongoClient.connect(config.chatDB);
        // Get the documents collection
        let collection = db.collection(config_1.DbClient.messageColl);
        // Create an index on the a field
        yield collection.createIndex({ rid: 1, createTime: 1 }, { background: true, w: 1 });
        let docs = yield collection.find({ rid: roomId, createTime: { $gt: new Date(isoDate.toISOString()) } }).limit(100).sort({ createTime: 1 }).toArray();
        db.close();
        return docs;
    });
}
exports.getNewerMessageOfChatRoom = getNewerMessageOfChatRoom;
function getOlderMessageChunkCount(rid, topEdgeMessageTime) {
    return __awaiter(this, void 0, void 0, function* () {
        let utc = new Date(topEdgeMessageTime);
        let db = yield MongoClient.connect(config.chatDB);
        // Get the documents collection
        let collection = db.collection(config_1.DbClient.messageColl);
        // Find some documents
        let docs = yield collection.count({ rid: rid, createTime: { $lt: new Date(utc.toISOString()) } });
        db.close();
        return docs;
    });
}
exports.getOlderMessageChunkCount = getOlderMessageChunkCount;
function getOlderMessageChunkOfRid(rid, topEdgeMessageTime) {
    return __awaiter(this, void 0, void 0, function* () {
        let utc = new Date(topEdgeMessageTime);
        let db = yield MongoClient.connect(config.chatDB);
        // Get the documents collection
        let collection = db.collection(config_1.DbClient.messageColl);
        // Find some documents
        let docs = yield collection.find({ rid: rid, createTime: { $lt: new Date(utc.toISOString()) } }).limit(100).sort({ createTime: -1 }).toArray();
        db.close();
        return docs;
    });
}
exports.getOlderMessageChunkOfRid = getOlderMessageChunkOfRid;
exports.getUnreadMsgCountAndLastMsgContentInRoom = (roomId, lastAccessTime, callback) => {
    let isoDate = new Date(lastAccessTime).toISOString();
    // Use connect method to connect to the Server
    MongoClient.connect(config.chatDB).then(db => {
        // Get the documents collection
        let messagesColl = db.collection(config_1.DbClient.messageColl);
        messagesColl.createIndex({ rid: 1, createTime: 1 }, { background: true, w: 1 });
        messagesColl.find({ rid: roomId.toString(), createTime: { $gt: new Date(isoDate) } })
            .project({ _id: 1 }).sort({ createTime: 1 })
            .toArray()
            .then(docs => {
            db.close();
            if (docs.length > 0) {
                getLastMsgContentInMessagesIdArray(docs, function (err, res) {
                    if (!!res) {
                        callback(null, { count: docs.length, message: res });
                    }
                    else {
                        callback(null, { count: docs.length });
                    }
                });
            }
            else {
                getLastMessageContentOfRoom(roomId, function (err, res) {
                    if (!!res) {
                        callback(null, { count: docs.length, message: res });
                    }
                    else {
                        callback(null, { count: docs.length });
                    }
                });
            }
        }).catch(err => {
            db.close();
            callback(new Error("GetUnreadMsgOfRoom by query date is no response." + err), null);
        });
    }).catch(err => {
        callback("Cannot connect database." + err, null);
    });
};
/**
* return : =>
* unread msgs count.
* type of msg,
* msg.body
*/
const getLastMsgContentInMessagesIdArray = (docs, callback) => {
    let lastDoc = docs[docs.length - 1];
    // Use connect method to connect to the Server
    MongoClient.connect(config.chatDB).then(function (db) {
        // Get the documents collection
        let collection = db.collection(config_1.DbClient.messageColl);
        // Find some documents
        collection.find({ _id: new ObjectID(lastDoc._id) }).limit(1).toArray().then(docs => {
            if (docs.length > 0) {
                callback(null, docs[0]);
            }
            else {
                callback("no have last message", null);
            }
            db.close();
        }).catch(err => callback(new Error("getLastMsgContentInMessagesIdArray error." + err), null));
    }).catch(err => callback(err, null));
};
const getLastMessageContentOfRoom = (rid, callback) => {
    // Use connect method to connect to the Server
    MongoClient.connect(config.chatDB).then((db) => {
        // Get the documents collection
        let collection = db.collection(config_1.DbClient.messageColl);
        collection.createIndex({ rid: 1 }, { background: true, w: 1 });
        // Find newest message documents
        collection.find({ rid: rid.toString() }).sort({ createTime: -1 }).limit(1).toArray().then(docs => {
            if (docs.length > 0) {
                callback(null, docs[0]);
            }
            else {
                callback("No have last message", null);
            }
            db.close();
        });
    }).catch(err => callback(err, null));
};
exports.GetChatRoomInfo = (room_id) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(config.chatDB).then(db => {
            let roomColl = db.collection(config_1.DbClient.chatroomColl);
            roomColl.find({ _id: new ObjectID(room_id) }).limit(1).toArray().then(docs => {
                db.close();
                resolve(docs);
            }).catch(err => {
                db.close();
                reject(err);
            });
        }).catch(err => {
            reject(err);
        });
    });
};
exports.createPrivateChatRoom = (room) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(config.chatDB).then(db => {
            let roomColl = db.collection(config_1.DbClient.chatroomColl);
            roomColl.insertOne(room).then(result => {
                db.close();
                resolve(result.ops);
            }).catch(err => {
                db.close();
                reject(err);
            });
        }).catch(err => {
            reject(err);
        });
    });
};
class ChatRoomManager {
    constructor() {
        this.userManager = UserManager.getInstance();
        this.roomDAL = new RoomDataAccess();
    }
    getProjectBaseGroups(userId, callback) {
        this.roomDAL.findProjectBaseGroups(userId, callback);
    }
    getPrivateGroupChat(uid, callback) {
        this.roomDAL.findPrivateGroupChat(uid, callback);
    }
    createPrivateGroup(groupName, memberIds, callback) {
        this.roomDAL.createPrivateGroup(groupName, memberIds, callback);
    }
    updateGroupImage(roomId, newUrl, callback) {
        this.roomDAL.userUpdateGroupImage(roomId, newUrl, callback);
    }
    editGroupMembers(editType, roomId, members, callback) {
        if (editType === "add") {
            this.roomDAL.addGroupMembers(roomId, members, callback);
        }
        else if (editType == "remove") {
            this.roomDAL.removeGroupMembers(roomId, members, callback);
        }
    }
    editGroupName(roomId, newGroupName, callback) {
        this.roomDAL.editGroupName(roomId, newGroupName, callback);
    }
    AddChatRecord(object, callback) {
        MongoClient.connect(MDb.DbController.chatDB).then(db => {
            let col = db.collection(MDb.DbController.messageColl);
            col.insertOne(object, { w: 1 }).then(function (r) {
                callback(null, r.ops);
                db.close();
            }).catch(err => {
                callback(err, null);
                db.close();
            });
        }).catch(err => {
            callback(err, null);
        });
    }
    createProjectBaseGroup(groupName, members, callback) {
        this.roomDAL.createProjectBaseGroup(groupName, members, callback);
    }
    editMemberInfoInProjectBase(roomId, member, callback) {
        this.roomDAL.editMemberInfoInProjectBase(roomId, member, callback);
    }
    updateChatRecordContent(messageId, content, callback) {
        dbClient.UpdateDocument(MDb.DbController.messageColl, (res) => {
            callback(null, res);
        }, { _id: new ObjectID(messageId) }, { $set: { body: content } });
    }
    updateWhoReadMessage(messageId, uid, callback) {
        this.roomDAL.updateWhoReadMessage(messageId, uid, callback);
    }
    /*
    * Get last limit query messages of specific user and room then return messages info.
    */
    getMessagesReaders(userId, roomId, topEdgeMessageTime, callback) {
        let utc = new Date(topEdgeMessageTime);
        MongoClient.connect(MDb.DbController.chatDB, function (err, db) {
            if (err) {
                return console.error(err);
            }
            // Get the documents collection
            let collection = db.collection(MDb.DbController.messageColl);
            // Create an index on the a field
            collection.createIndex({ rid: 1, sender: 1, createTime: 1 }, { background: true, w: 1 }, function (err, indexName) {
                if (err) {
                    db.close();
                    return console.error("Create index fail.", err);
                }
                // Find some documents
                collection.find({ rid: roomId, sender: userId, createTime: { $gt: new Date(utc.toISOString()) } })
                    .project({ readers: 1 }).sort({ createTime: -1 }).toArray(function (err, docs) {
                    if (!docs || err) {
                        callback(new Error("getMessagesInfoOfUserXInRoomY is no response."), err);
                    }
                    else {
                        console.log("getMessagesReaders found the following records", docs.length);
                        callback(null, docs);
                    }
                    db.close();
                });
            });
        });
    }
    /**
     * Require: message_id.
     * **************************
     * Return: sender of target message.
     * Return: reader fields of target messageId.
     */
    getWhoReadMessage(messageId, callback) {
        this.roomDAL.getWhoReadMessage(messageId, callback);
    }
    GetChatContent(messageId, callback) {
        MongoClient.connect(MDb.DbController.chatDB, function (err, db) {
            if (err) {
                return console.dir(err);
            }
            assert.equal(null, err);
            // Get the documents collection
            var collection = db.collection(MDb.DbController.messageColl);
            // Find some documents
            collection.find({ _id: new ObjectID(messageId) }).toArray((err, results) => {
                callback(err, results);
                db.close();
            });
        });
    }
    /**
     * Retrive all room in db and then get all members from each room.
     */
    getAllRooms(cb) {
        this.roomDAL.getAllRooms(function (res) {
            cb(res);
        });
    }
}
ChatRoomManager._Instance = null;
exports.ChatRoomManager = ChatRoomManager;
class RoomDataAccess {
    constructor() {
        this.userManager = UserManager.getInstance();
    }
    findProjectBaseGroups(userId, callback) {
        dbClient.FindDocuments(MDb.DbController.roomColl, function (res) {
            callback(null, res);
        }, { type: Room.RoomType.projectBaseGroup, status: Room.RoomStatus.active, members: { $elemMatch: { id: userId } } });
    }
    findPrivateGroupChat(uid, callback) {
        dbClient.FindDocuments(MDb.DbController.roomColl, function (res) {
            callback(null, res);
        }, { type: Room.RoomType.privateGroup, members: { $elemMatch: { id: uid } } });
    }
    /**
     * Get all rooms and then return all info of { _id, members } to array of roomModel;.
     */
    getAllRooms(callback) {
        dbClient.FindDocuments(MDb.DbController.roomColl, function (res) {
            callback(res);
        }, {});
    }
    createPrivateGroup(groupName, memberIds, callback) {
        var self = this;
        var members = new Array();
        memberIds.forEach((val, id, arr) => {
            var member = new Room.Member();
            member.id = val;
            members.push(member);
        });
        let newRoom = new Room.Room();
        newRoom.name = groupName;
        newRoom.type = Room.RoomType.privateGroup;
        newRoom.members = members;
        newRoom.createTime = new Date();
        dbClient.InsertDocument(MDb.DbController.roomColl, function (err, docs) {
            console.log("Create new group to db.", docs.length);
            if (docs !== null) {
                callback(null, docs);
            }
            else {
                callback(new Error("cannot insert new group to db collection."), null);
            }
        }, newRoom);
    }
    createProjectBaseGroup(groupName, members, callback) {
        var newRoom = new Room.Room();
        newRoom.name = groupName;
        newRoom.type = Room.RoomType.projectBaseGroup;
        newRoom.members = members;
        newRoom.createTime = new Date();
        newRoom.status = Room.RoomStatus.active;
        newRoom.nodeId = 0;
        MongoClient.connect(MDb.DbController.chatDB, function (err, db) {
            if (err) {
                return console.dir(err);
            }
            assert.equal(null, err);
            // Get the documents collection
            var collection = db.collection(MDb.DbController.roomColl);
            // Find some documents
            collection.insertOne(newRoom, (err, result) => {
                assert.equal(null, err);
                callback(err, result.ops);
                db.close();
            });
        });
    }
    userUpdateGroupImage(roomId, newUrl, callback) {
        var self = this;
        dbClient.UpdateDocument(MDb.DbController.roomColl, function (res) {
            callback(null, res);
        }, { _id: new ObjectID(roomId) }, { $set: { image: newUrl } }, { w: 1, upsert: true });
    }
    addGroupMembers(roomId, members, callback) {
        MongoClient.connect(MDb.DbController.chatDB, function (err, db) {
            if (err) {
                return console.dir(err);
            }
            // Get the documents collection
            var collection = db.collection(MDb.DbController.roomColl);
            // Find some documents
            collection.updateOne({ _id: new ObjectID(roomId) }, { $push: { members: { $each: members } } }, function (err, result) {
                assert.equal(null, err);
                if (err) {
                    callback(new Error(err.message), null);
                }
                else {
                    callback(null, result);
                }
                db.close();
            });
        });
    }
    removeGroupMembers(roomId, members, callback) {
        async.eachSeries(members, function iterator(item, errCb) {
            MongoClient.connect(MDb.DbController.chatDB, function (err, db) {
                if (err) {
                    return console.dir(err);
                }
                // Get the documents collection
                var collection = db.collection(MDb.DbController.roomColl);
                // Find some documents
                collection.updateOne({ _id: new ObjectID(roomId) }, { $pull: { members: { id: item.id } } }, function (err, result) {
                    assert.equal(null, err);
                    if (err) {
                        errCb(new Error(err.message));
                    }
                    else {
                        errCb();
                    }
                    db.close();
                });
            });
        }, function done(err) {
            if (err) {
                console.error('removeGroupMembers has a problem!', err.message);
                callback(err, null);
            }
            else {
                callback(null, "removeGroupMembers success.");
            }
        });
    }
    editGroupName(roomId, newGroupName, callback) {
        MongoClient.connect(MDb.DbController.chatDB, function (err, db) {
            if (err) {
                return console.dir(err);
            }
            // Get the documents collection
            var collection = db.collection(MDb.DbController.roomColl);
            // Find some documents
            collection.updateOne({ _id: new ObjectID(roomId) }, { $set: { name: newGroupName } }, function (err, result) {
                assert.equal(null, err);
                if (err) {
                    callback(new Error(err.message), null);
                }
                else {
                    callback(null, result);
                }
                db.close();
            });
        });
    }
    editMemberInfoInProjectBase(roomId, member, callback) {
        MongoClient.connect(MDb.DbController.chatDB, (err, db) => {
            // Get the collection
            var col = db.collection(MDb.DbController.roomColl);
            col.updateOne({ _id: new ObjectID(roomId), "members.id": member.id }, { $set: { "members.$": member } }, function (err, result) {
                assert.equal(1, result.matchedCount);
                callback(null, result);
                // Finish up test
                db.close();
            });
        });
    }
    updateWhoReadMessage(messageId, uid, callback) {
        dbClient.UpdateDocument(MDb.DbController.messageColl, function (res2) {
            if (!res2) {
                callback(new Error("updateChatRecordWhoRead fail."), null);
            }
            else {
                callback(null, res2);
            }
        }, { _id: new ObjectID(messageId) }, { $addToSet: { readers: uid } });
    }
    /*
     * Require: message_id.
     * **************************
     * Return: reader fields of target messageId.
     */
    getWhoReadMessage(messageId, callback) {
        dbClient.FindDocument(MDb.DbController.messageColl, (result) => {
            if (!result) {
                callback(new Error("getWhoReadMessage fail."), null);
            }
            else {
                callback(null, result);
            }
        }, { _id: new ObjectID(messageId) }, { sender: 1, readers: 1 });
    }
}
exports.RoomDataAccess = RoomDataAccess;
