"use strict";
exports.__esModule = true;
var nodeSecureService_1 = require("./nodeSecureService");
/**
 * SecureServiceFactory
 */
var SecureServiceFactory = (function () {
    function SecureServiceFactory() {
    }
    SecureServiceFactory.getService = function () {
        return new nodeSecureService_1["default"]();
    };
    return SecureServiceFactory;
}());
exports["default"] = SecureServiceFactory;
