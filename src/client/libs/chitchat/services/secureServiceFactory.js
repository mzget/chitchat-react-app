"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeSecureService_1 = require("./nodeSecureService");
/**
 * SecureServiceFactory
 */
class SecureServiceFactory {
    static getService() {
        return new nodeSecureService_1.default();
    }
}
exports.default = SecureServiceFactory;
