import { NodeSecureService } from "./nodeSecureService";
export class SecureServiceFactory {
    static createService(secret_key) {
        if (!SecureServiceFactory.service)
            SecureServiceFactory.service = new NodeSecureService(secret_key);
        return SecureServiceFactory.service;
    }
    static getService() {
        return SecureServiceFactory.service;
    }
}
