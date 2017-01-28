"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const mongodb = require("mongodb");
const { MongoClient, ObjectID } = mongodb;
const config_1 = require("../../../config");
const config = config_1.getConfig();
function createOrgChart(chart) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = yield MongoClient.connect(config.chatDB);
        let collection = db.collection(config_1.DbClient.orgChartCollection);
        let results = yield collection.insertOne(chart);
        db.close();
        return results.ops;
    });
}
exports.createOrgChart = createOrgChart;
