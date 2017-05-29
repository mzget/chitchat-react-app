"use strict";
var store = require("react-native-simple-store");
var NodeMessageDAL = (function () {
    function NodeMessageDAL() {
    }
    NodeMessageDAL.prototype.getData = function (rid) {
        return store.get(rid);
    };
    NodeMessageDAL.prototype.saveData = function (rid, chatRecord) {
        return store.save(rid, chatRecord);
    };
    NodeMessageDAL.prototype.removeData = function (rid, callback) {
    };
    NodeMessageDAL.prototype.clearData = function (next) {
    };
    return NodeMessageDAL;
}());
exports.NodeMessageDAL = NodeMessageDAL;
