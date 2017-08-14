import { History } from "history";
import { StalkRecord } from "../chitchat/chats/redux/stalkBridge/";
import { ChatLogRecord } from "../chitchat/chats/redux/chatlogs/";
import { ChatRoomRecoder } from "../chitchat/chats/redux/chatroom";

export interface IComponentProps {
    onError: (error: string) => void;
    location: Location;
    adminReducer;
    authReducer;
    userReducer: IUserReducer;
    chatroomReducer: ChatRoomRecoder;
    chatlogReducer: ChatLogRecord;
    stalkReducer: StalkRecord;
    teamReducer;
    groupReducer;
    alertReducer;
    dispatch;
    match: Match;
    history: History;
    staticContext;
}

export class IUserReducer {
    isFetching: boolean;
    state: string;
    user: any;
    teamProfile: any;
    error: string;
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