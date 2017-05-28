/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import * as Stalk from "stalk-js";
import { Stalk, ChatRoomApi, Utils, StalkEvents } from "stalk-js";
import DataManager from "./dataManager";
import DataListener from "./dataListener";
import { PushDataListener } from "./pushDataListener";
import { ChatsLogComponent } from "./chatslogComponent";
import { ServerEventListener } from "./ServerEventListener";
import { ChitChatFactory } from "./chitchatFactory";
const getConfig = () => ChitChatFactory.getInstance().config;
const ChatRoomApiProvider = ChatRoomApi.ChatRoomApiProvider;
const ServerImplemented = Stalk.ServerImplemented;
export class BackendFactory {
    static getInstance() {
        return BackendFactory.instance;
    }
    static createInstance() {
        if (!BackendFactory.instance) {
            BackendFactory.instance = new BackendFactory();
        }
        return BackendFactory.instance;
    }
    constructor() {
        console.log("BackendFactory:", Stalk, StalkEvents, ChatRoomApi, Utils);
        this.stalk = ServerImplemented.createInstance(getConfig().Stalk.chat, getConfig().Stalk.port);
        this.pushDataListener = new PushDataListener();
        this.dataManager = new DataManager();
        this.dataListener = new DataListener(this.dataManager);
    }
    createChatlogs() {
        this.chatLogComp = new ChatsLogComponent();
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
            this.chatRoomApiProvider = new ChatRoomApiProvider(this.stalk.getClient());
        }
        return this.chatRoomApiProvider;
    }
    getServerListener() {
        if (!this.serverEventsListener) {
            this.serverEventsListener = new ServerEventListener(this.stalk.getClient());
        }
        return this.serverEventsListener;
    }
    stalkInit() {
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
            Stalk.getInstance().logIn(email, hexPassword, deviceToken, (err, res) => {
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
            Stalk.getInstance().TokenAuthen(token, (err, res) => {
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
            if (Stalk.getInstance) {
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
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            // @ get connector server.
            let msg = {};
            msg["uid"] = uid;
            msg["x-api-key"] = getConfig().Stalk.apiKey;
            let connector = yield self.stalk.gateEnter(msg);
            return new Promise((resolve, reject) => {
                // @ Connecting to connector server.
                let params = { host: connector.host, port: connector.port, reconnect: false };
                self.stalk.connect(params, (err) => {
                    self.stalk._isConnected = true;
                    if (!!self.stalk.pomelo) {
                        self.stalk.listenForPomeloEvents();
                        self.stalk.pomelo.setReconnect(true);
                    }
                    if (!!err) {
                        reject(err);
                    }
                    else {
                        let msg = {};
                        msg["user"] = user;
                        msg["x-api-key"] = getConfig().Stalk.apiKey;
                        self.stalk.checkIn(msg).then(value => {
                            resolve(value);
                        }).catch(err => {
                            reject(err);
                        });
                    }
                });
            });
        });
    }
}
