"use strict";
/**
 * NodeMessageDAL.
 *
 * Copyright 2016 Ahoo Studio.co.th.
 *
 *
 *
 * Use react-native-simple-storage for stroage engines.
 */
const store = require('react-native-simple-store');
class NodeMessageDAL {
    getData(rid, done) {
        store.get(rid).then(function (value) {
            let docs = JSON.parse(JSON.stringify(value));
            console.log("get persistent message success.");
            done(null, docs);
        }).catch(function rejected(err) {
            console.warn(err);
        });
    }
    saveData(rid, chatRecord, callback) {
        return store.save(rid, chatRecord);
    }
    removeData(rid, callback) {
    }
    clearData(next) {
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NodeMessageDAL;
