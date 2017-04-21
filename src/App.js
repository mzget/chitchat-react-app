"use strict";
const React = require("react");
const react_redux_1 = require("react-redux");
const react_router_1 = require("react-router");
const chitchat_1 = require("./chitchat");
/**
 * ### configureStore
 *  ```configureStore``` will connect the ```reducers```,
 */
const configureStore_1 = require("./redux/configureStore");
const HomeEnhanced_1 = require("./containers/HomeEnhanced");
const ChatPageEnhanced_1 = require("./containers/ChatPageEnhanced");
const Chat_1 = require("./containers/Chat");
const ChatRoomSettings_1 = require("./containers/ChatRoomSettings");
const Team_1 = require("./containers/Team");
const ProfilePageEnhanced_1 = require("./containers/ProfilePageEnhanced");
const Main_1 = require("./containers/Main");
const m_Main_1 = require("./containers/m_Main");
const AdminPageEnhanced_1 = require("./containers/AdminPageEnhanced");
const Breakpoints_1 = require("./chitchat/consts/Breakpoints");
chitchat_1.chitchatFactory.initStore(configureStore_1.default);
configureStore_1.default.subscribe(() => {
    chitchat_1.chitchatFactory.setAuthStore(configureStore_1.default.getState().userReducer.user, configureStore_1.default.getState().authReducer.token);
    chitchat_1.chitchatFactory.setTeamStore({
        team: configureStore_1.default.getState().teamReducer.team,
        members: configureStore_1.default.getState().teamReducer.members
    });
});
class App extends React.Component {
    constructor() {
        super(...arguments);
        this.clientWidth = document.documentElement.clientWidth;
    }
    render() {
        return (React.createElement(react_redux_1.Provider, { store: configureStore_1.default },
            React.createElement(react_router_1.Router, { history: react_router_1.browserHistory },
                React.createElement(react_router_1.Route, { path: "/(:filter)", component: HomeEnhanced_1.HomeEnhanced }),
                React.createElement(react_router_1.Route, { path: "/chat/(:filter)", component: (this.clientWidth < Breakpoints_1.MEDIUM_HANDSET) ? ChatPageEnhanced_1.ChatPageEnhanced : Chat_1.ChatPage }),
                React.createElement(react_router_1.Route, { path: "/chat/:filter/:room_id", component: ChatRoomSettings_1.default }),
                React.createElement(react_router_1.Route, { path: "/team/(:filter)", component: Team_1.default }),
                React.createElement(react_router_1.Route, { path: "/team/(:filter)/:user", component: ProfilePageEnhanced_1.ProfilePageEnhanced }),
                React.createElement(react_router_1.Route, { path: "/chatslist/(:filter)", component: (this.clientWidth < Breakpoints_1.MEDIUM_HANDSET) ? m_Main_1.default : Main_1.default }),
                React.createElement(react_router_1.Route, { path: "/admin/(:filter)", component: AdminPageEnhanced_1.AdminPageEnhanced }))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
