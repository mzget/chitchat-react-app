import * as localForage from "localforage";

import { SimpleStoreInterface } from "./SimpleStoreInterface";

export class SimpleStorageFactory {
    static warehouse = new Map<string, SimpleStorage>();

    static getObject(storeName: string) {
        if (!this.warehouse.has(storeName)) {
            let store = new SimpleStorage(storeName);

            return this.warehouse.set(storeName, store).get(storeName);
        }
        else {
            return this.warehouse.get(storeName);
        }
    }
}

class SimpleStorage implements SimpleStoreInterface {
    store: LocalForage;

    constructor(storeName: string) {
        this.store = localForage.createInstance({
            name: storeName
        });

        localForage.keys().then(items => console.log(items));
    }

    get(key: string) {
        return this.store.getItem(key);
    }

    save(key: string, data: any) {
        return this.store.setItem(key, data);
    }

    remove(key: string) {
        this.store.removeItem(key);
    }

    getKeys() {
        return this.store.keys();
    }

    clear() {
        return this.store.clear();
    }
}