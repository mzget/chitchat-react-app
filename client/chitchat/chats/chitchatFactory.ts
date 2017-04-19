import { IStalkApi, IChitChatApi, IConfig } from "./iConfig";
import { ITeamMember } from "./models/IteamMember";
export type AuthStore = {
    user: any;
    chitchat_token: string;
};

export type TeamStore = {
    team: any;
    members: Array<ITeamMember>,
};

export type AppStore = {
    appState: string;
};


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

    authStore: AuthStore;
    public setAuthStore(user: any, chitchat_token: string) {
        this.authStore = { user: user, chitchat_token: chitchat_token };
    }

    teamStore: TeamStore;
    public setTeamStore(store: TeamStore) {
        this.teamStore = store;
    }

    appStore: AppStore = { appState: "active" }; // active, background, inactive
    public setAppStore(store: AppStore) {
        this.appStore = store;
    }
}