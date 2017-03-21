import mongodb = require("mongodb");

const { MongoClient, ObjectID } = mongodb;

import { Config, DbClient } from "../../../config";
import { IOrgChart, OrgLevel } from "../../../../react/shared/models/OrgChart";

export async function createOrgChart(chart: IOrgChart) {
    let db = await MongoClient.connect(Config.chatDB);
    let collection = db.collection(DbClient.orgChartCollection);

    await collection.createIndex({ team_id: 1 }, { background: true });

    let results = await collection.insertOne(chart);
    db.close();
    return results.ops;
}

export async function getOrgChart(team_id: string) {
    let db = await MongoClient.connect(Config.chatDB);
    let collection = db.collection(DbClient.orgChartCollection);

    let docs: Array<IOrgChart> = await collection.find({ team_id: team_id }).toArray();
    db.close();
    return docs;
}