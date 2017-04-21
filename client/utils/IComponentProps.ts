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
    routing;
    route;
    routes;
    adminReducer;
    authReducer;
    userReducer: IUserReducer;
    chatroomReducer;
    chatlogReducer;
    stalkReducer;
    teamReducer;
    groupReducer;
    alertReducer;
    dispatch;
}


export class IUserReducer {
    isFetching: boolean;
    state: string;
    user: any;
    teamProfile: any;
    error: string;
}