import mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
type ObjectID = mongodb.ObjectID;
import { getConfig, DbClient } from '../../../config';
const config = getConfig();

import { ITeam } from '../../models/ITeam';
import { ChitChatAccount } from "../../models/User";
import * as GroupController from '../group/GroupController';


export async function findTeamsInfo(team_ids: Array<ObjectID>) {
    let db = await MongoClient.connect(config.chatDB);
    let collection = db.collection(DbClient.teamsColl);

    let teams = await collection.find({ _id: { $in: team_ids } }).limit(10).toArray();
    db.close();
    return teams as Array<ITeam>;
}

export async function findTeamName(team_name: string) {

    let _team = team_name.toLowerCase();

    let db = await MongoClient.connect(config.chatDB);
    let collection = db.collection(DbClient.teamsColl);

    collection.createIndex({ name: 1 }, { background: true });

    let teams: Array<ITeam> = await collection.find({ name: _team }).limit(1).toArray();

    db.close();
    return teams;
}

export async function searchTeam(team_name: string) {

    let _team = team_name.toLowerCase();

    let db = await MongoClient.connect(config.chatDB);
    let collection = db.collection(DbClient.teamsColl);

    collection.createIndex({ name: 1 }, { background: true });

    let _key = new RegExp("^" + _team);
    let teams: Array<ITeam> = await collection.find({ name: { $regex: _key, $options: "i" } }).limit(100).toArray();

    db.close();
    return teams;
}

export async function createTeam(team_name: string, owner: ChitChatAccount) {
    let db = await MongoClient.connect(config.chatDB);
    let collection = db.collection(DbClient.teamsColl);

    collection.createIndex({ name: 1 }, { background: true });

    let defaultGroup = await GroupController.createDefaultGroup(owner);
    let _group = defaultGroup[0];

    let team = {} as ITeam;
    team.name = team_name.toLowerCase();
    team.createAt = new Date();
    team.defaultGroup = _group;
    team.groups = new Array(_group._id.toString());

    let result = await collection.insert(team);

    let newTeam = result.ops;
    if (newTeam.length > 0) {
        GroupController.addTeamToGroup(_group, newTeam[0]);
    }

    db.close();
    return result.ops;
}