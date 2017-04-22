"use strict";
const React = require("react");
const react_redux_1 = require("react-redux");
const react_router_dom_1 = require("react-router-dom");
const chitchat_1 = require("./chitchat");
/**
 * ### configureStore
 *  ```configureStore``` will connect the ```reducers```,
 */
const configureStore_1 = require("./redux/configureStore");
const HomeEnhanced_1 = require("./containers/HomeEnhanced");
const ChatPageEnhanced_1 = require("./containers/ChatPageEnhanced");
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
            React.createElement(react_router_dom_1.BrowserRouter, null,
                React.createElement("div", null,
                    React.createElement(react_router_dom_1.Route, { exact: true, path: "/", component: HomeEnhanced_1.HomeEnhanced }),
                    React.createElement(react_router_dom_1.Route, { path: "/team/:filter", component: Team_1.default }),
                    React.createElement(react_router_dom_1.Route, { path: "/profile/:filter/:user", component: (this.clientWidth < Breakpoints_1.SMALL_TABLET) ? ProfilePageEnhanced_1.ProfilePageEnhanced : Main_1.MainPageEnhanced }),
                    React.createElement(react_router_dom_1.Route, { path: "/chatslist/:filter", component: (this.clientWidth < Breakpoints_1.SMALL_TABLET) ? m_Main_1.M_MainPageEnhanced : Main_1.MainPageEnhanced }),
                    React.createElement(react_router_dom_1.Route, { path: "/chatroom/:filter/:room_id", component: (this.clientWidth < Breakpoints_1.SMALL_TABLET) ? ChatPageEnhanced_1.ConnectedChatPageEnhanced : Main_1.MainPageEnhanced }),
                    React.createElement(react_router_dom_1.Route, { path: "/chatroom/:filter/:room_id", component: ChatRoomSettings_1.default }),
                    React.createElement(react_router_dom_1.Route, { path: "/admin/:filter", component: AdminPageEnhanced_1.AdminPageEnhanced })))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
