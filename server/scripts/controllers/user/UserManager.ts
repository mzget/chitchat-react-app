﻿
import mongodb = require('mongodb');
import async = require('async');

import { ChitChatAccount } from "../../../../react/shared/models/User";
import { ITeamProfile } from "../../../../react/shared/models/TeamProfile";
import * as Room from "../../../../react/shared/models/Room";
import { RoomAccessData, StalkAccount } from '../../../../react/shared/models/Stalk';
import { ITeam } from '../../../../react/shared/models/ITeam';

import { Config, DbClient } from "../../../config";
import { getAppDb } from "../../DbClient";
const { ObjectID } = mongodb;

export interface IUserDict {
    [id: string]: ChitChatAccount;
};

export async function joinTeam(team: ITeam, user_id: string) {
    let db = getAppDb();
    let collection = db.collection(DbClient.chitchatUserColl);

    let result = await collection.updateOne(
        { _id: new mongodb.ObjectID(user_id) },
        { $addToSet: { teams: team._id.toString() } },
        { upsert: false });

    return result;
}

export const getLastProfileChanged = (uid: string, callback: (err, res) => void) => {

}

export const updateUserInfo = async (uid: string, user: ChitChatAccount) => {
    let db = getAppDb();
    let chitchatUserColl = db.collection(DbClient.chitchatUserColl);

    let update = {
        firstname: user.firstname,
        lastname: user.lastname,
        tel: user.tel,
        avatar: user.avatar
    } as ChitChatAccount;

    let result = await chitchatUserColl.updateOne({ _id: new mongodb.ObjectID(uid) }, {
        $currentDate: {
            lastModified: true
        },
        $set: update
    }, { upsert: false });

    return result.result;
};

export async function getRoomAccessForUser(uid: string): Promise<any[]> {
    let db = getAppDb();
    let userColl = db.collection(DbClient.stalkUserColl);

    let docs = await userColl.find({ _id: new ObjectID(uid) }).project({ roomAccess: 1 }).limit(1).toArray();

    return docs;
}

export const getRoomAccessOfRoom = async (uid: string, rid: string) => {
    let db = getAppDb();
    let collection = db.collection(DbClient.stalkUserColl);

    let docs = await collection.find({ _id: new ObjectID(uid) })
        .project({ roomAccess: { $elemMatch: { roomId: rid } } })
        .limit(1).toArray();

    return docs;
};

export async function AddRoomIdToRoomAccessFieldOfUsers(roomId: string, memberIds: string[], date: Date) {
    let isDone = false;

    await new Promise((resolve, reject) => {
        async.each(memberIds, function (element: string, cb) {
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
}

export async function AddRoomIdToRoomAccessFieldOfUser(roomId: string, userId: string, date: Date) {
    let db = getAppDb();
    let chatUserCollection = db.collection(DbClient.stalkUserColl);

    let docs = await chatUserCollection.find({ _id: new ObjectID(userId) }, { roomAccess: 1 }).limit(1).toArray();
    if (docs.length > 0 && !!docs[0].roomAccess) {
        // <!-- add rid to MembersFields.
        let result = await findRoomAccessDataMatchWithRoomId(userId, roomId, date);
        return result;
    }
    else {
        let result = await InsertMembersFieldsToUserModel(userId, roomId, date);
        return result;
    }
}

export const updateLastAccessTimeOfRoom = async (user_id: string, room_id: string, date: Date) => {
    let db = getAppDb();
    let stalkUsersColl = db.collection(DbClient.stalkUserColl);

    let docs: Array<StalkAccount> = await stalkUsersColl.find({ _id: new ObjectID(user_id) }).limit(1)
        .project({ roomAccess: 1 }).toArray();

    if (docs.length > 0 && docs[0].roomAccess) {
        let result = await findRoomAccessDataMatchWithRoomId(user_id, room_id, date);
        return result;
    }
    else {
        // <!-- insert roomAccess info field in user data collection.
        let result = await insertRoomAccessInfoField(user_id, room_id);
        return result;
    }
};

export const updateFavoriteMembers = (editType: string, member: string, uid: string, callback: (err, res) => void) => {
    if (editType === "add") {
        this.userDataAccess.addFavoriteMembers(member, uid, callback);
    }
    else if (editType === "remove") {
        this.userDataAccess.removeFavoriteMembers(member, uid, callback);
    }
}

export const updateFavoriteGroups = (editType: string, group: string, uid: string, callback: (err, res) => void) => {
    if (editType === "add") {
        this.userDataAccess.addFavoriteGroup(group, uid, callback);
    }
    else if (editType === "remove") {
        this.userDataAccess.removeFavoriteGroup(group, uid, callback);
    }
}

export const updateClosedNoticeUsersList = (editType: string, member: string, uid: string, callback: (err, res) => void) => {
    if (editType === "add") {
        this.userDataAccess.addClosedNoticeUsersList(member, uid, callback);
    }
    else if (editType === "remove") {
        this.userDataAccess.removeClosedNoticeUsersList(member, uid, callback);
    }
}

export const updateClosedNoticeGroups = (editType: string, group: string, uid: string, callback: (err, res) => void) => {
    if (editType === "add") {
        this.userDataAccess.addClosedNoticeGroupList(group, uid, callback);
    }
    else if (editType === "remove") {
        this.userDataAccess.removeClosedNoticeGroupList(group, uid, callback);
    }
}

/**
* Check creator permission for create ProjectBase Group requesting.
* res will return { _id, role } of user model.
*/
export const getCreatorPermission = (creator: string, callback: (err, res) => void) => {
    this.userDataAccess.getRole(creator, (err, res) => {
        //<!-- res will return { _id, role } of user model.
        if (err || res === null) {
            callback(err, null);
        }
        else {
            callback(null, res);
        }
    });
}

export const checkUnsubscribeRoom = (userId: string, roomType: Room.RoomType, roomId: string, callback: Function) => {
    if (roomType === Room.RoomType.privateGroup) {
        MongoClient.connect(Config.chatDB).then(function (db) {
            // Get the documents collection
            let user = db.collection(DbClient.stalkUserColl);

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
        MongoClient.connect(Config.chatDB).then(db => {
            // Get the documents collection
            let user = db.collection(DbClient.stalkUserColl);

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
}

const InsertMembersFieldsToUserModel = async (uid: string, roomId: string, date: Date) => {
    let newRoomAccessInfos: RoomAccessData[] = new Array<RoomAccessData>();
    newRoomAccessInfos[0] = new RoomAccessData();
    newRoomAccessInfos[0].roomId = roomId;
    newRoomAccessInfos[0].accessTime = date;

    let db = getAppDb();
    let chatUserColl = db.collection(DbClient.stalkUserColl);
    let result = await chatUserColl.updateOne({ _id: new ObjectID(uid) }, { $set: { roomAccess: newRoomAccessInfos } }, { upsert: true });

    return result.result;
}

const insertRoomAccessInfoField = async (user_id: string, room_id: string) => {
    let newRoomAccessInfos = new Array<RoomAccessData>();
    newRoomAccessInfos[0] = new RoomAccessData();
    newRoomAccessInfos[0].roomId = room_id;
    newRoomAccessInfos[0].accessTime = new Date();

    let db = getAppDb();
    let chatUserCollection = db.collection(DbClient.stalkUserColl);
    let result = await chatUserCollection.updateOne(
        { _id: new ObjectID(user_id) },
        { $set: { roomAccess: newRoomAccessInfos } },
        { upsert: true, w: 1 });

    return result.result;
}

const findRoomAccessDataMatchWithRoomId = async (uid: string, rid: string, date: Date) => {
    let db = getAppDb();
    let chatUserColl = db.collection(DbClient.stalkUserColl);

    // Peform a simple find and return all the documents
    let docs = await chatUserColl.find({ _id: new ObjectID(uid) })
        .project({ roomAccess: { $elemMatch: { roomId: rid.toString() } } })
        .toArray();

    if (!docs || !docs[0].roomAccess) {
        //<!-- Push new roomAccess data. 
        let newRoomAccessInfo = new RoomAccessData();
        newRoomAccessInfo.roomId = rid.toString();
        newRoomAccessInfo.accessTime = date;

        let result = await chatUserColl.updateOne({ _id: new ObjectID(uid) }, { $push: { roomAccess: newRoomAccessInfo } }, { w: 1 });

        console.log("Push new roomAccess.: ", result.result);
        return result.result;
    }
    else {
        //<!-- Update if data exist.
        let result = await chatUserColl.updateOne({ _id: new ObjectID(uid), "roomAccess.roomId": rid }, { $set: { "roomAccess.$.accessTime": date } }, { w: 1 });

        console.log("Updated roomAccess.accessTime: ", result.result);
        return result.result;
    }
}

export const getUserProfile = (query: any, projection: any, callback: (err, res: Array<any>) => void) => {
    MongoClient.connect(Config.chatDB).then(db => {
        // Get the documents collection
        let collection = db.collection(DbClient.stalkUserColl);
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
}

export const getRole = (creator: string, callback: (err, res) => void) => {
    MongoClient.connect(Config.chatDB).then(db => {
        // Get the documents collection
        let collection = db.collection(DbClient.stalkUserColl);
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
}

export const addFavoriteMembers = (member: string, uid: string, callback: (err, res) => void) => {
    MongoClient.connect(Config.chatDB).then(db => {
        // Get the documents collection
        let collection = db.collection(DbClient.stalkUserColl);

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
}

export const removeFavoriteMembers = (member: string, uid: string, callback: (err, res) => void) => {
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
}

export const addFavoriteGroup = (group: string, uid: string, callback: (err, res) => void) => {
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
}
export const removeFavoriteGroup = (group: string, uid: string, callback: (err, res) => void) => {
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
}

export const addClosedNoticeUsersList = (member: string, uid: string, callback: (err, res) => void) => {
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
}

export const removeClosedNoticeUsersList = (member: string, uid: string, callback: (err, res) => void) => {
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
}

export const addClosedNoticeGroupList = (member: string, uid: string, callback: (err, res) => void) => {
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
}

export const removeClosedNoticeGroupList = (member: string, uid: string, callback: (err, res) => void) => {
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
}

export async function updateOrgChart(user_id: string, team_id: string, org_chart_id: string) {
    let db = getAppDb();
    let teamProfileColl = db.collection(DbClient.teamProfileCollection);

    await teamProfileColl.createIndex({ team_id: 1, user_id: 1 }, { background: true });

    let profile = {} as ITeamProfile;
    profile.team_id = new mongodb.ObjectID(team_id);
    profile.user_id = new mongodb.ObjectID(user_id);
    profile.org_chart_id = new mongodb.ObjectID(org_chart_id);

    let result = await teamProfileColl.updateOne(
        { user_id: profile.user_id, team_id: profile.team_id },
        { $set: { org_chart_id: profile.org_chart_id } },
        { upsert: true });

    return result.result;
}

export async function getUserOrgChart(user_id: string, team_id: string) {
    let db = getAppDb();
    let teamProfileColl = db.collection(DbClient.teamProfileCollection);

    await teamProfileColl.createIndex({ team_id: 1, user_id: 1 }, { background: true });

    let profile = {} as ITeamProfile;
    profile.team_id = new mongodb.ObjectID(team_id);
    profile.user_id = new mongodb.ObjectID(user_id);

    let docs = await teamProfileColl.find({ user_id: profile.user_id, team_id: profile.team_id })
        .project({ org_chart_id: 1 }).limit(1).toArray();

    return docs as Array<ITeamProfile>;
}

export async function getTeamProfile(user_id: string, team_id: string) {
    let db = getAppDb();
    let teamProfileColl = db.collection(DbClient.teamProfileCollection);

    let profile = {} as ITeamProfile;
    profile.team_id = new mongodb.ObjectID(team_id);
    profile.user_id = new mongodb.ObjectID(user_id);

    let docs = await teamProfileColl.find({ user_id: profile.user_id, team_id: profile.team_id }).limit(1).toArray();

    return docs as Array<ITeamProfile>;
}