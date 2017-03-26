"use strict";
/**
 * MessageDALFactory.
 *
 * Copyright 2016 Ahoo Studio.co.th.
 */
class MessageDALFactory {
    static getObject() {
        if (!!global.userAgent) {
            const { MessageDAL } = require("./messageDAL");
            return new MessageDAL();
        }
        else {
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MessageDALFactory;
