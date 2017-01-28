import mongodb =require( "mongodb");

const {MongoClient, ObjectID} = mongodb;

import { getConfig, DbClient } from "../../../config";
import { IOrgChart, OrgLevel } from "../../models/OrgChart";

const config = getConfig();

export async function createOrgChart(chart: IOrgChart) {
    let db = await MongoClient.connect(config.chatDB);
    let collection = db.collection(DbClient.orgChartCollection);

    let results = await collection.insertOne(chart);
    db.close();
    return results.ops;
}