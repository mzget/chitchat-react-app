import { Router } from "react-router";

export interface IComponentProps {
    onError?: (error: string) => void;
    location: {
        query: {
            contactId: string;
            userId: string;
            roomId: string;
            username: string;
        }
    };
    params;
    router: Router.InjectedRouter;
    dispatch;
    routing;
    adminReducer;
    authReducer;
    userReducer;
    chatroomReducer;
    chatlogReducer;
    stalkReducer;
    teamReducer;
    groupReducer;
};