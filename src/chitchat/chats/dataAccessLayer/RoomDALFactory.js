"use strict";
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * RoomDALFactory.
 *
 */
var RoomDALFactory = (function () {
    function RoomDALFactory() {
    }
    RoomDALFactory.getObject = function () {
        if (!!global.userAgent) {
            var RoomDAL = require("./RoomDAL").RoomDAL;
            return new RoomDAL();
        }
        else {
        }
    };
    return RoomDALFactory;
}());
exports.RoomDALFactory = RoomDALFactory;
