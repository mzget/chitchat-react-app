/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 *  RoomDAL.ts
 */

import { SimpleStoreInterface } from "./SimpleStoreInterface";

import * as localForage from "localforage";

export class RoomDAL implements SimpleStoreInterface {
    private store: LocalForage;
    constructor() {
        this.store = localForage.createInstance({
            name: "rooms"
        });
    }

    save(key, data: any): Promise<any> {
        return this.store.setItem(key, data);
    }

    get(key): Promise<any> {
        return this.store.getItem(key);
    }

    remove(key: any): Promise<any> {
        return this.store.removeItem(key);
    }

    clear(): Promise<any> {
        return this.store.clear();
    }

    getKeys() {
        return this.store.keys();
    }
}