import mongodb = require( 'mongodb');

const MongoClient = mongodb.MongoClient;
import { getConfig, DbClient } from '../../../config';
const config = getConfig();

import { ITeam } from '../../models/ITeam';

export async function findTeamName(team_name: string) {

    let _team = team_name.toLowerCase();

    let db = await MongoClient.connect(config.chatDB);
    let collection = db.collection(DbClient.teamsColl);

    collection.createIndex({ name: 1 }, { background: true });

    let teams: Array<ITeam> = await collection.find({ name: _team }).limit(1).toArray();

    db.close();
    return teams;
}

export async function createTeam(team_name: string) {
    let db = await MongoClient.connect(config.chatDB);
    let collection = db.collection(DbClient.teamsColl);

    collection.createIndex({ name: 1 }, { background: true });

    let team = {} as ITeam;
    team.name = team_name.toLowerCase();
    team.createAt = new Date();

    let result = await collection.insert(team);

    db.close();
    return result.ops;
}