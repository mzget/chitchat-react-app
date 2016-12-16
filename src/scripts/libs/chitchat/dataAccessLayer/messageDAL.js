import * as localForage from "localforage";
export class MessageDAL {
    constructor() {
        // localforage.config({
        //     driver: localforage.WEBSQL, // Force WebSQL; same as using setDriver()
        //     name: 'myApp',
        //     version: 1.0,
        //     size: 4980736, // Size of database, in bytes. WebSQL-only for now.
        //     storeName: 'keyvaluepairs', // Should be alphanumeric, with underscores.
        //     description: 'some description'
        // });
        this.store = localForage.createInstance({
            name: "message"
        });
    }
    getData(rid, done) {
        this.store.getItem(rid).then(function (value) {
            let docs = JSON.parse(JSON.stringify(value));
            console.log("get persistent success");
            done(null, docs);
        }).catch(function rejected(err) {
            console.warn(err);
        });
    }
    saveData(rid, chatRecord, callback) {
        let self = this;
        this.store.setItem(rid, chatRecord).then(function (value) {
            console.log("save persistent success");
            if (callback != null) {
                callback(null, value);
            }
        }).catch(function rejected(err) {
            console.warn(err);
            self.removeData(rid);
            if (callback != null) {
                callback(err, null);
            }
        });
    }
    removeData(rid, callback) {
        this.store.removeItem(rid).then(() => {
            console.info('room_id %s is removed: ', rid);
            if (callback) {
                callback(null, null);
            }
        }).catch((err) => {
            console.warn(err);
        });
    }
    clearData(next) {
        console.warn('MessageDAL.clearData');
        this.store.clear((err) => {
            if (err != null) {
                console.warn("Clear database fail", err);
            }
            console.warn("message db now empty.");
            next(err);
        });
    }
}
