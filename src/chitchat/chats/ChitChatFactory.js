import { SecureServiceFactory } from "./secure/secureServiceFactory";
export class ChitChatFactory {
    constructor() {
        this.appStore = { appState: "active" }; // active, background, inactive
    }
    static getInstance() {
        return ChitChatFactory.instance;
    }
    static createInstance() {
        if (ChitChatFactory.instance == null || ChitChatFactory.instance == undefined) {
            ChitChatFactory.instance = new ChitChatFactory();
            return ChitChatFactory.instance;
        }
        else
            return ChitChatFactory.instance;
    }
    initStore(_store) {
        this.store = _store;
    }
    initConfig(_config) {
        this.config = _config;
    }
    initSecureService() {
        if (this.config.appConfig.encryption == true) {
            SecureServiceFactory.createService(this.config.appConfig.secret);
        }
    }
    getStore() { return this.store; }
    getConfig() { return this.config; }
    setAuthStore(user, chitchat_token) {
        this.authStore = { user: user, chitchat_token: chitchat_token };
    }
    setTeamStore(store) {
        this.teamStore = store;
    }
    setAppStore(store) {
        this.appStore = store;
    }
}
