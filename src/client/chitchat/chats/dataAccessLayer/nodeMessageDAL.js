const store = require("react-native-simple-store");
export class NodeMessageDAL {
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
