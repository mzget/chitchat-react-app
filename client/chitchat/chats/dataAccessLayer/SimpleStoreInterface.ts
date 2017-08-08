/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 *  IRoomDAL.ts
 */

export interface SimpleStoreInterface {
    save: (key: string, data: any) => Promise<any>;
    get: (key: string) => Promise<any>;
    getKeys: () => Promise<string[]>;
    remove: (key: string) => void;
    clear: () => void;
}