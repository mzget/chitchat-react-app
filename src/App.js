"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var react_redux_1 = require("react-redux");
var react_router_dom_1 = require("react-router-dom");
var Chitchat_1 = require("./Chitchat");
/**
 * ### configureStore
 *  ```configureStore``` will connect the ```reducers```,
 */
var configureStore_1 = require("./redux/configureStore");
var HomeEnhanced_1 = require("./containers/HomeEnhanced");
var ChatPageEnhanced_1 = require("./containers/ChatPageEnhanced");
var ChatRoomSettingsPage_1 = require("./containers/ChatRoomSettingsPage");
var TeamPageEnhanced_1 = require("./containers/TeamPageEnhanced");
var ProfilePageEnhanced_1 = require("./containers/ProfilePageEnhanced");
var Main_1 = require("./containers/Main");
var m_Main_1 = require("./containers/m_Main");
var AdminPageEnhanced_1 = require("./containers/AdminPageEnhanced");
var Breakpoints_1 = require("./chitchat/consts/Breakpoints");
Chitchat_1.chitchatFactory.initStore(configureStore_1["default"]);
configureStore_1["default"].subscribe(function () {
    Chitchat_1.chitchatFactory.setAuthStore(configureStore_1["default"].getState().userReducer.user, configureStore_1["default"].getState().authReducer.token);
    Chitchat_1.chitchatFactory.setTeamStore({
        team: configureStore_1["default"].getState().teamReducer.team,
        members: configureStore_1["default"].getState().teamReducer.members
    });
});
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.clientWidth = document.documentElement.clientWidth;
        return _this;
    }
    App.prototype.render = function () {
        return (React.createElement(react_redux_1.Provider, { store: configureStore_1["default"] },
            React.createElement(react_router_dom_1.BrowserRouter, null,
                React.createElement("div", null,
                    React.createElement(react_router_dom_1.Route, { exact: true, path: "/", component: HomeEnhanced_1.HomePageWithDialogBox }),
                    React.createElement(react_router_dom_1.Route, { path: "/team/:filter", component: TeamPageEnhanced_1.TeamPageEnhanced }),
                    React.createElement(react_router_dom_1.Route, { path: "/profile/:filter/:user", component: (this.clientWidth < Breakpoints_1.SMALL_TABLET) ? ProfilePageEnhanced_1.ProfilePageEnhanced : Main_1.MainPageWithDialogBox }),
                    React.createElement(react_router_dom_1.Route, { path: "/chatslist/:filter", component: (this.clientWidth < Breakpoints_1.SMALL_TABLET) ? m_Main_1.M_MainPageEnhanced : Main_1.MainPageWithDialogBox }),
                    React.createElement(react_router_dom_1.Route, { path: "/chatroom/chat/:room_id", component: (this.clientWidth < Breakpoints_1.SMALL_TABLET) ? ChatPageEnhanced_1.ChatPageEnhanced : Main_1.MainPageWithDialogBox }),
                    React.createElement(react_router_dom_1.Route, { path: "/chatroom/settings/:room_id/:edit", component: (this.clientWidth < Breakpoints_1.SMALL_TABLET) ? ChatRoomSettingsPage_1.ChatRoomSettingsEnhanced : Main_1.MainPageWithDialogBox }),
                    React.createElement(react_router_dom_1.Route, { path: "/admin/:filter", component: AdminPageEnhanced_1.AdminPageEnhanced })))));
    };
    return App;
}(React.Component));
exports.__esModule = true;
exports["default"] = App;
