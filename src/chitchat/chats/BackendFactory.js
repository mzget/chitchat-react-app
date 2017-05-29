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
import { Stalk, ChatRoomApi, StalkFactory } from "stalk-js";
import DataManager from "./dataManager";
import DataListener from "./dataListener";
import { PushDataListener } from "./pushDataListener";
import { ChatsLogComponent } from "./chatslogComponent";
import { ServerEventListener } from "./ServerEventListener";
import { ChitChatFactory } from "./chitchatFactory";
const getConfig = () => ChitChatFactory.getInstance().config;
const { ChatRoomApiProvider } = ChatRoomApi;
const { ServerImplemented } = Stalk;
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
        console.log("BackendFactory:");
        this.pushDataListener = new PushDataListener();
        this.dataManager = new DataManager();
        this.dataListener = new DataListener(this.dataManager);
    }
    createChatlogs() {
        this.chatLogComp = new ChatsLogComponent();
        return this.chatLogComp;
    }
    getServer() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.stalk._isConnected)
                return yield this.stalk;
            else
                throw new Error("Stalk connection not yet ready.");
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
        return __awaiter(this, void 0, void 0, function* () {
            this.stalk = StalkFactory.create(getConfig().Stalk.chat, getConfig().Stalk.port);
            let socket = yield StalkFactory.init(this.stalk);
            return socket;
        });
    }
    handshake(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ get connector server.
                let msg = {};
                msg["uid"] = uid;
                msg["x-api-key"] = getConfig().Stalk.apiKey;
                let connector = yield StalkFactory.geteEnter(this.stalk, msg);
                let params = { host: connector.host, port: connector.port, reconnect: false };
                yield StalkFactory.handshake(this.stalk, params);
                return yield connector;
            }
            catch (ex) {
                throw new Error("handshake fail: " + ex.message);
            }
        });
    }
    checkIn(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let msg = {};
            msg["user"] = user;
            msg["x-api-key"] = getConfig().Stalk.apiKey;
            let result = yield StalkFactory.checkIn(this.stalk, msg);
            return result;
        });
    }
    checkOut() {
        return __awaiter(this, void 0, void 0, function* () {
            yield StalkFactory.checkOut(this.stalk);
        });
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
            self.checkOut();
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
}
