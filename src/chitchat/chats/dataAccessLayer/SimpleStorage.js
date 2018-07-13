import * as localForage from "localforage";
export class SimpleStorageFactory {
    static getObject(storeName) {
        if (!this.warehouse.has(storeName)) {
            let store = new SimpleStorage(storeName);
            return this.warehouse.set(storeName, store).get(storeName);
        }
        else {
            return this.warehouse.get(storeName);
        }
    }
}
SimpleStorageFactory.warehouse = new Map();
export class SimpleStorage {
    constructor(storeName) {
        this.store = localForage.createInstance({
            name: storeName
        });
    }
    get(key) {
        return this.store.getItem(key);
    }
    save(key, data) {
        return this.store.setItem(key, data);
    }
    remove(key) {
        this.store.removeItem(key);
    }
    getKeys() {
        return this.store.keys();
    }
    clear() {
        return this.store.clear();
    }
}
