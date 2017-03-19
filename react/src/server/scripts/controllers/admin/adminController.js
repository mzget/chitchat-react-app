"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb = require("mongodb");
const { MongoClient, ObjectID } = mongodb;
const config_1 = require("../../../config");
function createOrgChart(chart) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield MongoClient.connect(config_1.Config.chatDB);
        let collection = db.collection(config_1.DbClient.orgChartCollection);
        yield collection.createIndex({ team_id: 1 }, { background: true });
        let results = yield collection.insertOne(chart);
        db.close();
        return results.ops;
    });
}
exports.createOrgChart = createOrgChart;
function getOrgChart(team_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield MongoClient.connect(config_1.Config.chatDB);
        let collection = db.collection(config_1.DbClient.orgChartCollection);
        let docs = yield collection.find({ team_id: team_id }).toArray();
        db.close();
        return docs;
    });
}
exports.getOrgChart = getOrgChart;
