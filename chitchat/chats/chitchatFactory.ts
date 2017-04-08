import { IStalkApi, IChitChatApi, IConfig } from "./iConfig";

export class ChitChatFactory {
    private static instance: ChitChatFactory;
    public static getInstance(): ChitChatFactory {
        return ChitChatFactory.instance;
    }
    public static createInstance() {
        if (ChitChatFactory.instance == null || ChitChatFactory.instance == undefined) {
            ChitChatFactory.instance = new ChitChatFactory();

            return ChitChatFactory.instance;
        }
    }

    store;
    public initStore(_store) {
        this.store = _store;
    }
    config: IConfig;
    public initConfig(_config: IConfig) {
        this.config = _config;
    }

    public getStore() { return this.store; }
    public getConfig(): IConfig { return this.config; }
}