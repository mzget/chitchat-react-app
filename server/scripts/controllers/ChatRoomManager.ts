﻿import mongodb = require('mongodb');
import async = require('async');
import Room = require("../models/Room");
import message = require("../models/Message");
import * as UserManager from './user/UserManager';
const ObjectID = mongodb.ObjectID;
const MongoClient = mongodb.MongoClient;
import { getConfig, DbClient } from "../../config";
const config = getConfig();


/*
* Require 
*@roomId for query chat record in room.
*@lastAccessTime for query only message who newer than lastAccessTime.
*/
export async function getNewerMessageOfChatRoom(roomId: string, isoDate: Date) {
    let db = await MongoClient.connect(config.chatDB);
    // Get the documents collection
    let collection = db.collection(DbClient.messageColl);
    // Create an index on the a field
    await collection.createIndex({ rid: 1, createTime: 1 }, { background: true, w: 1 });

    let docs = await collection.find({ rid: roomId, createTime: { $gt: new Date(isoDate.toISOString()) } }).limit(100).sort({ createTime: 1 }).toArray();
    db.close();
    return docs;
}

export async function getOlderMessageChunkCount(rid: string, topEdgeMessageTime: string) {
    let utc = new Date(topEdgeMessageTime);

    let db = await MongoClient.connect(config.chatDB);
    // Get the documents collection
    let collection = db.collection(DbClient.messageColl);

    // Find some documents
    let docs = await collection.count({ rid: rid, createTime: { $lt: new Date(utc.toISOString()) } });

    db.close();
    return docs;
}

export async function getOlderMessageChunkOfRid(rid: string, topEdgeMessageTime: string) {
    let utc = new Date(topEdgeMessageTime);

    let db = await MongoClient.connect(config.chatDB);
    // Get the documents collection
    let collection = db.collection(DbClient.messageColl);

    // Find some documents
    let docs = await collection.find({ rid: rid, createTime: { $lt: new Date(utc.toISOString()) } }).limit(100).sort({ createTime: -1 }).toArray();

    db.close();
    return docs;
}

export const getUnreadMsgCountAndLastMsgContentInRoom = (roomId: string, lastAccessTime: string, callback: (err, result) => void) => {
    let isoDate = new Date(lastAccessTime).toISOString();

    // Use connect method to connect to the Server
    MongoClient.connect(config.chatDB).then(db => {
        // Get the documents collection
        let messagesColl = db.collection(DbClient.messageColl);
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
}

/**
* return : =>
* unread msgs count.
* type of msg, 
* msg.body
*/
const getLastMsgContentInMessagesIdArray = (docs: any[], callback: (err, resutl) => void) => {
    let lastDoc = docs[docs.length - 1];

    // Use connect method to connect to the Server
    MongoClient.connect(config.chatDB).then(function (db) {
        // Get the documents collection
        let collection = db.collection(DbClient.messageColl);
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
}

const getLastMessageContentOfRoom = (rid: string, callback: (err, result) => void) => {
    // Use connect method to connect to the Server
    MongoClient.connect(config.chatDB).then((db) => {
        // Get the documents collection
        let collection = db.collection(DbClient.messageColl);
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
}

export const GetChatRoomInfo = (room_id: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(config.chatDB).then(db => {
            let roomColl = db.collection(DbClient.chatroomColl);

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
}

export const createPrivateChatRoom = (room: Room.Room): Promise<any> => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(config.chatDB).then(db => {
            let roomColl = db.collection(DbClient.chatroomColl);

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
}

export class ChatRoomManager {
    private static _Instance: ChatRoomManager = null;
    private userManager = UserManager.getInstance();
    private roomDAL = new RoomDataAccess();


    public getProjectBaseGroups(userId: string, callback: (err, res) => void) {
        this.roomDAL.findProjectBaseGroups(userId, callback);
    }

    public getPrivateGroupChat(uid: string, callback: (err, res) => void) {
        this.roomDAL.findPrivateGroupChat(uid, callback);
    }

    public createPrivateGroup(groupName: string, memberIds: string[], callback: (err, res) => void) {
        this.roomDAL.createPrivateGroup(groupName, memberIds, callback);
    }

    public updateGroupImage(roomId: string, newUrl: string, callback: (err, res) => void) {
        this.roomDAL.userUpdateGroupImage(roomId, newUrl, callback);
    }

    public editGroupMembers(editType: string, roomId: string, members: Room.Member[], callback: (err, res) => void) {
        if (editType === "add") {
            this.roomDAL.addGroupMembers(roomId, members, callback);
        }
        else if (editType == "remove") {
            this.roomDAL.removeGroupMembers(roomId, members, callback);
        }
    }

    public editGroupName(roomId: string, newGroupName: string, callback: (err, res) => void) {
        this.roomDAL.editGroupName(roomId, newGroupName, callback);
    }

    public AddChatRecord(object: message.Message, callback: (err, docs: Array<message.Message>) => void) {
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


    public createProjectBaseGroup(groupName: string, members: Room.Member[], callback: (err, res) => void) {
        this.roomDAL.createProjectBaseGroup(groupName, members, callback);
    }

    public editMemberInfoInProjectBase(roomId: string, member: Room.Member, callback: (Error, res) => void) {
        this.roomDAL.editMemberInfoInProjectBase(roomId, member, callback);
    }

    public updateChatRecordContent(messageId: string, content: string, callback: (err, res) => void) {
        dbClient.UpdateDocument(MDb.DbController.messageColl, (res) => {
            callback(null, res);
        }, { _id: new ObjectID(messageId) }, { $set: { body: content } });
    }

    public updateWhoReadMessage(messageId: string, uid: string, callback: (err, res) => void) {
        this.roomDAL.updateWhoReadMessage(messageId, uid, callback);
    }

    /*
    * Get last limit query messages of specific user and room then return messages info. 
    */
    public getMessagesReaders(userId: string, roomId: string, topEdgeMessageTime: string, callback: (err, res) => void) {
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
    public getWhoReadMessage(messageId: string, callback: (err, res) => void) {
        this.roomDAL.getWhoReadMessage(messageId, callback);
    }

    public GetChatContent(messageId: string, callback: (err, res: any[]) => void) {
        MongoClient.connect(MDb.DbController.chatDB, function (err, db) {
            if (err) { return console.dir(err); }
            assert.equal(null, err);

            // Get the documents collection
            var collection = db.collection(MDb.DbController.messageColl);
            // Find some documents
            collection.find({ _id: new ObjectID(messageId) }).toArray((err: Error, results: any[]) => {
                callback(err, results);

                db.close();
            });
        });
    }

    /**
     * Retrive all room in db and then get all members from each room. 
     */
    public getAllRooms(cb: (result: Array<any>) => void) {
        this.roomDAL.getAllRooms(function (res) {
            cb(res)
        });
    }

}

export class RoomDataAccess {
    private userManager = UserManager.getInstance();

    findProjectBaseGroups(userId: string, callback: (err, res) => void) {
        dbClient.FindDocuments(MDb.DbController.roomColl, function (res) {
            callback(null, res);
        }, { type: Room.RoomType.projectBaseGroup, status: Room.RoomStatus.active, members: { $elemMatch: { id: userId } } });
    }

    findPrivateGroupChat(uid: string, callback: (err, res) => void) {
        dbClient.FindDocuments(MDb.DbController.roomColl, function (res) {
            callback(null, res);
        }, { type: Room.RoomType.privateGroup, members: { $elemMatch: { id: uid } } });
    }

    /**
     * Get all rooms and then return all info of { _id, members } to array of roomModel;.
     */
    getAllRooms(callback: (result: Array<any>) => void) {
        dbClient.FindDocuments(MDb.DbController.roomColl, function (res) {
            callback(res);
        }, {});
    }

    public createPrivateGroup(groupName: string, memberIds: string[], callback: (err, res) => void) {
        var self = this;
        var members: Array<Room.Member> = new Array<Room.Member>();

        memberIds.forEach((val, id, arr) => {
            var member: Room.Member = new Room.Member();
            member.id = val;
            members.push(member);
        });

        var newRoom = new Room.Room();
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

    public createProjectBaseGroup(groupName: string, members: Room.Member[], callback: (err, res) => void) {
        var newRoom = new Room.Room();
        newRoom.name = groupName;
        newRoom.type = Room.RoomType.projectBaseGroup;
        newRoom.members = members;
        newRoom.createTime = new Date();
        newRoom.status = Room.RoomStatus.active;
        newRoom.nodeId = 0;

        MongoClient.connect(MDb.DbController.chatDB, function (err, db) {
            if (err) { return console.dir(err); }
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

    public userUpdateGroupImage(roomId: string, newUrl: string, callback: (err, res) => void) {
        var self = this;

        dbClient.UpdateDocument(MDb.DbController.roomColl, function (res) {
            callback(null, res);
        }, { _id: new ObjectID(roomId) }, { $set: { image: newUrl } }, { w: 1, upsert: true });
    }

    public addGroupMembers(roomId: string, members: Room.Member[], callback: (err, res) => void) {
        MongoClient.connect(MDb.DbController.chatDB, function (err, db) {
            if (err) { return console.dir(err); }

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

    public removeGroupMembers(roomId: string, members: Room.Member[], callback: (err, res) => void) {
        async.eachSeries(members, function iterator(item, errCb) {
            MongoClient.connect(MDb.DbController.chatDB, function (err, db) {
                if (err) { return console.dir(err); }

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

    public editGroupName(roomId: string, newGroupName: string, callback: (err, res) => void) {
        MongoClient.connect(MDb.DbController.chatDB, function (err, db) {
            if (err) { return console.dir(err); }

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

    public editMemberInfoInProjectBase(roomId: string, member: Room.Member, callback: (err, res) => void) {
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

    public updateWhoReadMessage(messageId: string, uid: string, callback: (err, res) => void) {
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
    public getWhoReadMessage(messageId: string, callback: (err, res) => void) {
        dbClient.FindDocument(MDb.DbController.messageColl, (result) => {
            if (!result) {
                callback(new Error("getWhoReadMessage fail."), null);
            }
            else {
                callback(null, result);
            }
        },
            { _id: new ObjectID(messageId) },
            { sender: 1, readers: 1 });
    }
}