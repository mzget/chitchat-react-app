"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChitChatFactory {
    static getInstance() {
        return ChitChatFactory.instance;
    }
    static createInstance() {
        if (ChitChatFactory.instance == null || ChitChatFactory.instance == undefined) {
            ChitChatFactory.instance = new ChitChatFactory();
            return ChitChatFactory.instance;
        }
    }
    initStore(_store) {
        this.store = _store;
    }
    initConfig(_config) {
        this.config = _config;
    }
    getStore() { return this.store; }
    getConfig() { return this.config; }
    setAuthStore(user, chitchat_token) {
        this.authStore = { user: user, chitchat_token: chitchat_token };
    }
}
exports.ChitChatFactory = ChitChatFactory;
