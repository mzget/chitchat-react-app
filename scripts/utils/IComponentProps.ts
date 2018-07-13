import { History } from "history";

export interface IComponentProps {
    onError: (error: string) => void;
    location: Location;
    adminReducer;
    authReducer;
    userReducer: IUserReducer;
    chatroomReducer: any;
    chatlogReducer: any;
    stalkReducer: any;
    teamReducer;
    groupReducer;
    alertReducer;
    dispatch;
    match: Match;
    history: History;
    staticContext;
}

export class IUserReducer {
    isFetching: boolean = false;
    state: string = "";
    user: any;
    teamProfile: any;
    error: string = "";
}

type Location = {
    hash;
    key;
    pathname;
    search;
    state;
};
type Match = {
    match;
    isExact;
    params;
    path;
    url;
};