/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 */

import { Stalk, IDictionary, API, Utils, StalkEvents, StalkFactory, ServerImplemented } from "stalk-js";
import { DataManager } from "./DataManager";
import { DataListener } from "./DataListener";
import { PushDataListener, CallingDataListener } from "./";
import { ChatsLogComponent } from "./ChatslogComponent";
import { ServerEventListener } from "./ServerEventListener";

import { ChitChatFactory } from "./ChitChatFactory";
const getConfig = () => ChitChatFactory.getInstance().config;

class BackendFactory {
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
    serverEventsListener: ServerEventListener;
    pushDataListener: PushDataListener;
    callingDataListener: CallingDataListener;
    dataManager: DataManager;
    dataListener: DataListener;
    chatLogComp: ChatsLogComponent;

    constructor() {
        this.pushDataListener = new PushDataListener();
        this.callingDataListener = new CallingDataListener();
        this.dataManager = new DataManager();
        this.dataListener = new DataListener(this.dataManager);
    }

    getServer() {
        if (this.stalk._isConnected) {
            return this.stalk;
        }
        else {
            console.log("Stalk connection not yet ready.");
            return null;
        }
    }

    async stalkInit() {
        this.stalk = StalkFactory.create(getConfig().Stalk.chat, getConfig().Stalk.port);
        let socket = await StalkFactory.init(this.stalk);
        return socket;
    }

    async handshake(uid: string) {
        try {
            // @ get connector server.
            const msg = {} as IDictionary;
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
        let msg = {} as IDictionary;
        msg["user"] = user;
        msg["x-api-key"] = getConfig().Stalk.apiKey;
        let result = await StalkFactory.checkIn(this.stalk, msg);
        return result;
    }

    private async checkOut() {
        await StalkFactory.checkOut(this.stalk);
    }

    /**
     * @returns 
     * 
     * @memberof BackendFactory
     */
    logout() {
        let self = this;
        let promise = new Promise(function exe(resolve, reject) {
            self.checkOut();

            if (!!self.pushDataListener) { self.pushDataListener = null; }
            if (!!self.dataManager) { self.dataManager = null; }
            if (!!self.dataListener) { self.dataListener = null; }

            BackendFactory.instance = null;
            resolve();
        });

        return promise;
    }

    createChatlogs() {
        this.chatLogComp = new ChatsLogComponent();

        return this.chatLogComp;
    }

    getServerListener() {
        if (!this.serverEventsListener) {
            this.serverEventsListener = new ServerEventListener(this.stalk.getSocket());
        }

        return this.serverEventsListener;
    }

    subscriptions() {
        this.serverEventsListener.addServerListener(this.dataListener);
        this.serverEventsListener.addChatListener(this.dataListener);
        this.serverEventsListener.addPushListener(this.pushDataListener);
        this.serverEventsListener.addCallingListener(this.callingDataListener);
    }
}
