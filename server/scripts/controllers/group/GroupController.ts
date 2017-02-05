import mongodb = require('mongodb');

import { getConfig, DbClient } from "../../../config";
import { Room, RoomStatus, RoomType, Member, MemberRole } from "../../models/Room";
import { ITeam } from "../../models/ITeam";
import { ChitChatAccount } from "../../models/User";

const config = getConfig();
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

export async function createDefaultGroup(owner: ChitChatAccount) {
    let db = await MongoClient.connect(config.chatDB);
    let collection = db.collection(DbClient.chatroomColl);

    let member = new Member();
    member._id = owner._id;
    member.joinTime = new Date();
    member.room_role = MemberRole.owner;
    member.username = owner.username;

    let group = new Room();
    group.createTime = new Date();
    group.description = "Default group";
    group.members = [member];
    group.name = "General";
    group.status = RoomStatus.active;
    group.type = RoomType.organizationGroup;

    let result = await collection.insert(group);

    db.close();

    return result.ops as Room[];
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

export async function getOrgGroups(team_id: string, user_id: string) {
    let db = await MongoClient.connect(config.chatDB);
    let collection = db.collection(DbClient.chatroomColl);

    collection.createIndex({ team_id: 1 }, { background: true });

    let docs = await collection.find({
        team_id: team_id,
        "members._id": { $in: [user_id] },
        type: RoomType.organizationGroup
    }).toArray();
    db.close();
    return docs;
}

export async function addMember(group_id: string, user: ChitChatAccount) {
    let db = await MongoClient.connect(config.chatDB);
    let collection = db.collection(DbClient.chatroomColl);

    let member = new Member();
    member._id = user._id;
    member.joinTime = new Date();
    member.room_role = MemberRole.member;
    member.username = user.username;

    let results = await collection.update({ _id: new mongodb.ObjectID(group_id) },
        { $addToSet: { members: member } },
        { upsert: false });

    db.close();
    return results.result;
}

export async function removeUserOutOfOrgChartGroups(user_id: string, orgChart_id: string) {
    let db = await MongoClient.connect(config.chatDB);
    let groupCollection = db.collection(DbClient.chatroomColl);

    let results = await groupCollection.updateMany({ org_chart_id: orgChart_id },
        { $pull: { members: { $elemMatch: { _id: user_id } } } },
        { upsert: false });

    db.close();
    return results.result;
}

export async function addUserToOrgChartGroups(user_id: string, username: string, orgChart_id: string) {
    let db = await MongoClient.connect(config.chatDB);
    let groupCollection = db.collection(DbClient.chatroomColl);

    let member = new Member();
    member._id = user_id;
    member.joinTime = new Date();
    member.room_role = MemberRole.member;
    member.username = username;

    let results = await groupCollection.updateMany({ org_chart_id: orgChart_id },
        { $addToSet: { members: member } },
        { upsert: false });

    db.close();
    return results.result;
}