/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 */

import { ServerImplemented, ServerParam, IDictionary } from "../libs/stalk/serverImplemented";
import ChatRoomApiProvider from "../libs/stalk/chatRoomApiProvider";
import ServerEventListener from "../libs/stalk/serverEventListener";
import DataManager from "./dataManager";
import DataListener from "./dataListener";
import PushDataListener from "./pushDataListener";
import { ChatsLogComponent } from "./chatslogComponent";

import { ChitChatFactory } from "./chitchatFactory";
const getConfig = () => ChitChatFactory.getInstance().config;

export class BackendFactory {
    private static instance: BackendFactory;
    public static getInstance(): BackendFactory {
        return BackendFactory.instance;
    }
    public static createInstance(): BackendFactory {
        if (!BackendFactory.instance) {
            BackendFactory.instance = new BackendFactory();
        }

        return BackendFactory.instance;
    }

    stalk: ServerImplemented;
    chatRoomApiProvider: ChatRoomApiProvider;
    serverEventsListener: ServerEventListener;
    pushDataListener: PushDataListener;
    dataManager: DataManager;
    dataListener: DataListener;
    chatLogComp: ChatsLogComponent;

    constructor() {
        console.log("BackendFactory:");

        this.stalk = ServerImplemented.createInstance(getConfig().Stalk.chat, getConfig().Stalk.port);
        this.pushDataListener = new PushDataListener();
        this.dataManager = new DataManager();
        this.dataListener = new DataListener(this.dataManager);
    }

    createChatlogs() {
        this.chatLogComp = new ChatsLogComponent();

        return this.chatLogComp;
    }

    getServer(): Promise<ServerImplemented> {
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

    login(username: string, hexPassword: string, deviceToken: string): Promise<any> {
        let email = username;
        let promise = new Promise(function executor(resolve, reject) {
            ServerImplemented.getInstance().logIn(email, hexPassword, deviceToken, (err, res) => {
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

    loginByToken(tokenBearer: string): Promise<any> {
        let token = tokenBearer;
        let promise = new Promise((resolved, rejected) => {
            console.warn(token);
            ServerImplemented.getInstance().TokenAuthen(token, (err, res) => {
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
            if (ServerImplemented.getInstance) {
                if (!!self.stalk.pomelo)
                    self.stalk.pomelo.setReconnect(false);
                self.stalk.logout();
                self.stalk.dispose();
            }

            if (!!self.pushDataListener) self.pushDataListener = null;
            if (!!self.dataManager) self.dataManager = null;
            if (!!self.dataListener) self.dataListener = null;

            BackendFactory.instance = null;
            resolve();
        });

        return promise;
    }

    startChatServerListener(resolve?) {
        this.serverEventsListener.addFrontendListener(this.dataManager);
        this.serverEventsListener.addServerListener(this.dataListener);
        this.serverEventsListener.addChatListener(this.dataListener);
        this.serverEventsListener.addPushListener(this.pushDataListener);

        this.serverEventsListener.addListenner(resolve);
    }

    async checkIn(uid: string, token: string, user: any) {
        let self = this;

        // @ get connector server.
        let msg = {} as IDictionary;
        msg["uid"] = uid;
        msg["x-api-key"] = getConfig().Stalk.apiKey;
        let connector = await self.stalk.gateEnter(msg);

        return new Promise((resolve, reject) => {
            // @ Connecting to connector server.
            let params = { host: connector.host, port: connector.port, reconnect: false } as ServerParam;

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
                    let msg = {} as IDictionary;
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
    }
}