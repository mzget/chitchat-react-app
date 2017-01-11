"use strict";
const nodeSecureService_1 = require("./nodeSecureService");
/**
 * SecureServiceFactory
 */
class SecureServiceFactory {
    static getService() {
        return new nodeSecureService_1.default();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SecureServiceFactory;
