import mongodb = require('mongodb');

import { getConfig, DbClient } from "../../../config";
import { Room, RoomStatus, RoomType } from "../../models/Room";
import { ITeam } from "../../models/ITeam";

const config = getConfig();
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

export async function createDefaultGroup() {
    let db = await MongoClient.connect(config.chatDB);
    let collection = db.collection(DbClient.chatroomColl);

    let group = new Room();
    group.createTime = new Date();
    group.description = "Default group";
    group.members = "*";
    group.name = "General";
    group.status = RoomStatus.active;
    group.type = RoomType.organizationGroup;

    let result = await collection.insert(group);

    db.close();

    return result.ops;
}

export async function addTeamToGroup(group: Room, team: ITeam) {
    let db = await MongoClient.connect(config.chatDB);
    let collection = db.collection(DbClient.chatroomColl);

    let result = await collection.update({ _id: new mongodb.ObjectID(group._id) }, {
        $set: {
            team_id: team._id
        }
    });

    db.close();
    return result.ops;
}

export async function getOrgGroups(team_id: mongodb.ObjectID) {
    let db = await MongoClient.connect(config.chatDB);
    let collection = db.collection(DbClient.chatroomColl);
    
    collection.createIndex({ team_id: 1 }, { background: true });

    let docs = await collection.find({ team_id: team_id, type: 0 }).toArray();
    db.close();
    return docs;
}