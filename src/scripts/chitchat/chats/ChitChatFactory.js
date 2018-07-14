export class ChitChatFactory {
    constructor() {
        this.appStore = { appState: "active" }; // active, background, inactive
    }
    static getInstance() {
        return ChitChatFactory.instance;
    }
    static createInstance() {
        if (ChitChatFactory.instance == null || ChitChatFactory.instance === undefined) {
            ChitChatFactory.instance = new ChitChatFactory();
            return ChitChatFactory.instance;
        }
        else {
            return ChitChatFactory.instance;
        }
    }
    initConfig(apiConfig) {
        this.config = apiConfig;
    }
    getConfig() { return this.config; }
    setTeamStore(store) {
        this.teamStore = store;
    }
    setAppStore(store) {
        this.appStore = store;
    }
}
