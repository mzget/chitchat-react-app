import NodeSecureService from "./nodeSecureService";
/**
 * SecureServiceFactory
 */
export default class SecureServiceFactory {
    static getService() {
        return new NodeSecureService();
    }
}
