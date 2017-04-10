"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const react_router_1 = require("react-router");
const chitchat_1 = require("./chitchat");
/**
 * ### configureStore
 *  ```configureStore``` will connect the ```reducers```,
 */
const configureStore_1 = require("./redux/configureStore");
const Home_1 = require("./containers/Home");
const Chat_1 = require("./containers/Chat");
const ChatRoomSettings_1 = require("./containers/ChatRoomSettings");
const Team_1 = require("./containers/Team");
const Profile_1 = require("./containers/Profile");
const Main_1 = require("./containers/Main");
const Admin_1 = require("./containers/Admin");
chitchat_1.chitchatFactory.initStore(configureStore_1.default);
class App extends React.Component {
    render() {
        return (React.createElement(react_redux_1.Provider, { store: configureStore_1.default },
            React.createElement(react_router_1.Router, { history: react_router_1.browserHistory },
                React.createElement(react_router_1.Route, { path: "/(:filter)", component: Home_1.default }),
                React.createElement(react_router_1.Route, { path: "/chat/(:filter)", component: Chat_1.default }),
                React.createElement(react_router_1.Route, { path: "/chat/:filter/:room_id", component: ChatRoomSettings_1.default }),
                React.createElement(react_router_1.Route, { path: "/team/(:filter)", component: Team_1.default }),
                React.createElement(react_router_1.Route, { path: "/team/(:filter)/:user", component: Profile_1.default }),
                React.createElement(react_router_1.Route, { path: "/chatslist/(:filter)", component: Main_1.default }),
                React.createElement(react_router_1.Route, { path: "/admin/(:filter)", component: Admin_1.default }))));
    }
}
exports.default = App;
