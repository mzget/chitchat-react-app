import mongodb = require('mongodb');

import { getConfig, DbClient } from '../../../config';
import { Room, RoomStatus, RoomType } from '../../models/Room';

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