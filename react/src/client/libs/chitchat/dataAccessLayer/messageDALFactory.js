"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            // const NodeMessageDAL = require("./nodeMessageDAL");
            // return new NodeMessageDAL();
        }
    }
}
exports.default = MessageDALFactory;
