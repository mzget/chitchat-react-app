/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * RoomDALFactory.
 *
 */
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * RoomDALFactory.
 *
 */ export class RoomDALFactory {
    static getObject() {
        console.log(global.userAgent);
        if (!!global.userAgent) {
            const { RoomDAL } = require("./RoomDAL");
            return new RoomDAL();
        }
        else {
        }
    }
}
