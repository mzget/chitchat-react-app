"use strict";
const store = require("react-native-simple-store");
class NodeMessageDAL {
    getData(rid) {
        return store.get(rid);
    }
    saveData(rid, chatRecord) {
        return store.save(rid, chatRecord);
    }
    removeData(rid, callback) {
    }
    clearData(next) {
    }
}
exports.NodeMessageDAL = NodeMessageDAL;
