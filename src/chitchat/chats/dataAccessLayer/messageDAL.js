import * as localForage from "localforage";
export class MessageDAL {
    constructor() {
        this.store = localForage.createInstance({
            name: "message"
        });
    }
    getData(rid) {
        return this.store.getItem(rid);
    }
    saveData(rid, chatRecord) {
        return this.store.setItem(rid, chatRecord);
    }
    removeData(rid, callback) {
        this.store.removeItem(rid).then(() => {
            console.info("room_id %s is removed: ", rid);
            if (callback) {
                callback(null, null);
            }
        }).catch((err) => {
            console.warn(err);
        });
    }
    clearData(next) {
        console.warn("MessageDAL.clearData");
        this.store.clear((err) => {
            if (err != null) {
                console.warn("Clear database fail", err);
            }
            console.warn("message db now empty.");
            next(err);
        });
    }
}
