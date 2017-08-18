import { combineReducers } from "redux";
import { reducer as notificationsReducer } from 'reapop';
import { ApolloClient, createNetworkInterface } from 'react-apollo';
import { chitchat_graphql } from "../Chitchat";
import { LOG_OUT_SUCCESS } from "./authen/authRx";
import { STALK_ON_SOCKET_RECONNECT } from "../chitchat/chats/redux/stalkBridge/stalkBridgeActions";
import { deviceReducer, DeviceInitialState } from "./device/deviceReducer";
import { teamReducer, TeamInitState } from "./team/teamRx";
import { UserInitState, userReducer } from "./user/userReducer";
import { AdminInitState, adminReducer } from "./admin/adminReducer";
import { AuthenInitState, authReducer } from "./authen/authReducer";
import { GroupInitState, groupReducer } from "./group/groupReducer";
import { stalkReducer, stalkInitState, StalkRecord } from "../chitchat/chats/redux/stalkBridge/stalkReducer";
import { chatroomReducer, chatRoomRecoder } from "../chitchat/chats/redux/chatroom/chatroomReducer";
import { chatlogReducer, ChatLogInitState } from "../chitchat/chats/redux/chatlogs/chatlogReducer";
import { alertReducer, AlertInitState } from "./app/alertReducer";
export const apolloClient = new ApolloClient({
    networkInterface: createNetworkInterface({
        uri: chitchat_graphql,
    })
});
const apolloReducer = apolloClient.reducer();
export const apolloMiddleWare = apolloClient.middleware();
const appReducer = combineReducers({
    deviceReducer,
    authReducer,
    teamReducer,
    groupReducer,
    stalkReducer,
    chatroomReducer,
    chatlogReducer,
    userReducer,
    adminReducer,
    alertReducer,
    notifications: notificationsReducer(),
    apollo: apolloReducer
});
export function getInitialState() {
    const _initState = {
        deviceReducer: new DeviceInitialState(),
        teamReducer: new TeamInitState(),
        groupReducer: new GroupInitState(),
        authReducer: new AuthenInitState(),
        stalkReducer: new StalkRecord(stalkInitState),
        chatroomReducer: chatRoomRecoder,
        chatlogReducer: new ChatLogInitState(),
        userReducer: new UserInitState(),
        adminReducer: new AdminInitState(),
        alertReducer: new AlertInitState()
    };
    return _initState;
}
export const rootReducer = (state, action) => {
    if (state.authReducer.state === LOG_OUT_SUCCESS || state.stalkReducer.state == STALK_ON_SOCKET_RECONNECT) {
        state = getInitialState();
    }
    return appReducer(state, action);
};
