export interface IStalkApi {
    chat: string;
    port: number;
    api: {
        user: string;
    };
}

export interface IConfig {
    Stalk: IStalkApi;
    api: IChitChatApi;
    appConfig: {
        encryption: boolean
    };
};

export interface IChitChatApi {
    apiKey: string;
    host: string;
    api: string;
    auth: string;
    user: string;
    team: string;
    group: string;
    orgChart: string;
    chatroom: string;
    fileUpload: string;
};