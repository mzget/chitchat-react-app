"use strict";
/**
 * MessageDALFactory.
 *
 * Copyright 2016 Ahoo Studio.co.th.
 */
exports.__esModule = true;
var REACT_NATIVE = "react-native";
var REACTJS = "react-js";
var MessageDALFactory = (function () {
    function MessageDALFactory() {
    }
    MessageDALFactory.getObject = function () {
        if (!!global.userAgent && global.userAgent == REACTJS) {
            var MessageDAL = require("./messageDAL").MessageDAL;
            return new MessageDAL();
        }
        else if (!!global.userAgent && global.userAgent == REACT_NATIVE) {
            // const { NodeMessageDAL } = require("./nodeMessageDAL");
            // return new NodeMessageDAL();
        }
    };
    return MessageDALFactory;
}());
exports.MessageDALFactory = MessageDALFactory;
