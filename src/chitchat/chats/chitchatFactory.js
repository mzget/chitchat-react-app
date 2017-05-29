"use strict";
var ChitChatFactory = (function () {
    function ChitChatFactory() {
        this.appStore = { appState: "active" }; // active, background, inactive
    }
    ChitChatFactory.getInstance = function () {
        return ChitChatFactory.instance;
    };
    ChitChatFactory.createInstance = function () {
        if (ChitChatFactory.instance == null || ChitChatFactory.instance == undefined) {
            ChitChatFactory.instance = new ChitChatFactory();
            return ChitChatFactory.instance;
        }
    };
    ChitChatFactory.prototype.initStore = function (_store) {
        this.store = _store;
    };
    ChitChatFactory.prototype.initConfig = function (_config) {
        this.config = _config;
    };
    ChitChatFactory.prototype.getStore = function () { return this.store; };
    ChitChatFactory.prototype.getConfig = function () { return this.config; };
    ChitChatFactory.prototype.setAuthStore = function (user, chitchat_token) {
        this.authStore = { user: user, chitchat_token: chitchat_token };
    };
    ChitChatFactory.prototype.setTeamStore = function (store) {
        this.teamStore = store;
    };
    ChitChatFactory.prototype.setAppStore = function (store) {
        this.appStore = store;
    };
    return ChitChatFactory;
}());
exports.ChitChatFactory = ChitChatFactory;
