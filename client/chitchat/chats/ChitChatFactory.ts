import { IStalkConfig, IApiConfig } from "stalk-js/starter";
import { ITeamMember } from "./models/IteamMember";

export interface TeamStore {
    team: any;
    members: ITeamMember[];
}

export interface AppStore {
    appState: string;
}

// export class ChitChatFactory {
    // private static instance: ChitChatFactory;
    // public static getInstance() {
    //     return ChitChatFactory.instance;
    // }
    // public static createInstance() {
    //     if (ChitChatFactory.instance == null || ChitChatFactory.instance === undefined) {
    //         ChitChatFactory.instance = new ChitChatFactory();

    //         return ChitChatFactory.instance;
    //     } else {
    //         return ChitChatFactory.instance;
    //     }
    // }

    // public config: IApiConfig;
    // public initConfig(apiConfig: IApiConfig) {
    //     this.config = apiConfig;
    // }

    // public getConfig(): IApiConfig { return this.config; }

    // public teamStore: TeamStore;
    // public setTeamStore(store: TeamStore) {
    //     this.teamStore = store;
    // }

    // public appStore: AppStore = { appState: "active" }; // active, background, inactive
    // public setAppStore(store: AppStore) {
    //     this.appStore = store;
    // }
// }
