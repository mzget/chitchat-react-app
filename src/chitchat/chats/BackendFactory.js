/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 */
"use strict";
const serverImplemented_1 = require("../libs/stalk/serverImplemented");
const chatRoomApiProvider_1 = require("../libs/stalk/chatRoomApiProvider");
const serverEventListener_1 = require("../libs/stalk/serverEventListener");
const dataManager_1 = require("./dataManager");
const dataListener_1 = require("./dataListener");
const pushDataListener_1 = require("./pushDataListener");
const chatslogComponent_1 = require("./chatslogComponent");
const chitchatFactory_1 = require("./chitchatFactory");
const getConfig = () => chitchatFactory_1.ChitChatFactory.getInstance().config;
class BackendFactory {
    static getInstance() {
        if (BackendFactory.instance == null || BackendFactory.instance == undefined) {
            BackendFactory.instance = new BackendFactory();
        }
        return BackendFactory.instance;
    }
    constructor() {
        console.log("BackendFactory:");
        this.stalk = serverImplemented_1.ServerImplemented.createInstance(getConfig().Stalk.chat, getConfig().Stalk.port);
        this.pushDataListener = new pushDataListener_1.default();
        this.dataManager = new dataManager_1.default();
        this.dataListener = new dataListener_1.default(this.dataManager);
    }
    createChatlogs() {
        this.chatLogComp = new chatslogComponent_1.ChatsLogComponent();
        return this.chatLogComp;
    }
    getServer() {
        return new Promise((resolve, rejected) => {
            if (this.stalk._isConnected)
                resolve(this.stalk);
            else
                rejected();
        });
    }
    getChatApi() {
        if (!this.chatRoomApiProvider) {
            this.chatRoomApiProvider = new chatRoomApiProvider_1.default(this.stalk.getClient());
        }
        return this.chatRoomApiProvider;
    }
    getServerListener() {
        if (!this.serverEventsListener) {
            this.serverEventsListener = new serverEventListener_1.default(this.stalk.getClient());
        }
        return this.serverEventsListener;
    }
    stalkInit() {
        console.log("stalkInit...");
        let self = this;
        let promise = new Promise((resolve, reject) => {
            self.stalk.disConnect(function done() {
                console.log("disconnected first...");
                self.stalk.init((err, res) => {
                    if (!!err) {
                        reject(err);
                    }
                    else {
                        resolve(res);
                    }
                });
            });
        });
        return promise;
    }
    login(username, hexPassword, deviceToken) {
        let email = username;
        let promise = new Promise(function executor(resolve, reject) {
            serverImplemented_1.ServerImplemented.getInstance().logIn(email, hexPassword, deviceToken, (err, res) => {
                if (!!err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
        return promise;
    }
    loginByToken(tokenBearer) {
        let token = tokenBearer;
        let promise = new Promise((resolved, rejected) => {
            console.warn(token);
            serverImplemented_1.ServerImplemented.getInstance().TokenAuthen(token, (err, res) => {
                if (!!err) {
                    rejected(err);
                }
                else {
                    resolved(res);
                }
            });
        });
        return promise;
    }
    logout() {
        let self = this;
        let promise = new Promise(function exe(resolve, reject) {
            if (serverImplemented_1.ServerImplemented.getInstance) {
                if (!!self.stalk.pomelo)
                    self.stalk.pomelo.setReconnect(false);
                self.stalk.logout();
                self.stalk.dispose();
            }
            if (!!self.pushDataListener)
                self.pushDataListener = null;
            if (!!self.dataManager)
                self.dataManager = null;
            if (!!self.dataListener)
                self.dataListener = null;
            BackendFactory.instance = null;
            resolve();
        });
        return promise;
    }
    startChatServerListener(resolve) {
        this.serverEventsListener.addFrontendListener(this.dataManager);
        this.serverEventsListener.addServerListener(this.dataListener);
        this.serverEventsListener.addChatListener(this.dataListener);
        this.serverEventsListener.addPushListener(this.pushDataListener);
        this.serverEventsListener.addListenner(resolve);
    }
    checkIn(uid, token, user) {
        let self = this;
        return new Promise((resolve, rejected) => {
            self.stalk.gateEnter(uid).then(value => {
                // <!-- Connecting to connector server.
                let params = { host: value.host, port: value.port, reconnect: false };
                self.stalk.connect(params, (err) => {
                    self.stalk._isConnected = true;
                    if (!!self.stalk.pomelo) {
                        self.stalk.listenForPomeloEvents();
                        self.stalk.pomelo.setReconnect(true);
                    }
                    if (!!err) {
                        rejected(err);
                    }
                    else {
                        let msg = {};
                        msg["token"] = token;
                        msg["user"] = user;
                        self.stalk.signin(msg).then(value => {
                            resolve(value);
                        }).catch(err => {
                            rejected(err);
                        });
                    }
                });
            }).catch(err => {
                console.warn("Cannot connect gate-server.", err);
                rejected(err);
            });
        });
    }
}
exports.BackendFactory = BackendFactory;
