/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 */

import { Stalk, ChatRoomApi, Utils, StalkEvents, StalkFactory } from "stalk-js";
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

    stalk: Stalk.ServerImplemented;
    chatRoomApiProvider: ChatRoomApi.ChatRoomApiProvider;
    serverEventsListener: ServerEventListener;
    pushDataListener: PushDataListener;
    dataManager: DataManager;
    dataListener: DataListener;
    chatLogComp: ChatsLogComponent;

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

    async getServer() {
        if (this.stalk._isConnected)
            return await this.stalk;
        else
            throw new Error("Stalk connection not yet ready.");
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

    async stalkInit() {
        this.stalk = StalkFactory.create(getConfig().Stalk.chat, getConfig().Stalk.port);
        let socket = await StalkFactory.init(this.stalk);
        return socket;
    }

    async handshake(uid: string) {
        try {
            // @ get connector server.
            let msg = {} as Utils.dataDict;
            msg["uid"] = uid;
            msg["x-api-key"] = getConfig().Stalk.apiKey;
            let connector = await StalkFactory.geteEnter(this.stalk, msg);

            let params = { host: connector.host, port: connector.port, reconnect: false } as Stalk.ServerParam;
            await StalkFactory.handshake(this.stalk, params);

            return await connector;
        } catch (ex) {
            throw new Error("handshake fail: " + ex.message);
        }
    }

    async checkIn(user: any) {
        let msg = {} as Utils.dataDict;
        msg["user"] = user;
        msg["x-api-key"] = getConfig().Stalk.apiKey;
        let result = await StalkFactory.checkIn(this.stalk, msg);
        return result;
    }

    private async checkOut() {
        await StalkFactory.checkOut(this.stalk);
    }

    login(username: string, hexPassword: string, deviceToken: string): Promise<any> {
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

    loginByToken(tokenBearer: string): Promise<any> {
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
}