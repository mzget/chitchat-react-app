"use strict";
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * RoomDALFactory.
 *
 */
class RoomDALFactory {
    static getObject() {
        if (!!global.userAgent) {
            const { RoomDAL } = require("./RoomDAL");
            return new RoomDAL();
        }
        else {
        }
    }
}
exports.RoomDALFactory = RoomDALFactory;
