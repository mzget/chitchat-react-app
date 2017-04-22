"use strict";
const React = require("react");
const reflexbox_1 = require("reflexbox");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const ProfileBox_1 = require("./profile/ProfileBox");
const ConnectGroupListEnhancer_1 = require("./group/ConnectGroupListEnhancer");
const ChatLogsBox_1 = require("./chatlog/ChatLogsBox");
const ContactBox_1 = require("./chatlist/ContactBox");
const SnackbarToolBox_1 = require("./toolsbox/SnackbarToolBox");
const StalkComponent_1 = require("./stalk/StalkComponent");
const AppBody_1 = require("./AppBody");
const MainPageEnhancer_1 = require("./MainPageEnhancer");
const MainPageToolbar_1 = require("./MainPageToolbar");
exports.MainPageEnhanced = MainPageEnhancer_1.MainPageEnhancer(({ teamReducer, groupReducer, authReducer, userReducer, history, match, onError, fetch_orgGroups, fetch_privateGroups }) => React.createElement(MuiThemeProvider_1.default, null,
    React.createElement("div", null,
        React.createElement(MainPageToolbar_1.ToolbarEnhanced, { history: history, teamReducer: teamReducer, authReducer: authReducer, listener: MainPageToolbar_1.listener }),
        React.createElement("div", { id: "app_body", style: { overflowY: "auto" } },
            React.createElement(reflexbox_1.Flex, { flexColumn: false },
                React.createElement(reflexbox_1.Flex, { flexColumn: true },
                    React.createElement("div", { style: { overflowY: "auto" } },
                        React.createElement(ProfileBox_1.ProfileEnhancer, { router: history }),
                        React.createElement(ConnectGroupListEnhancer_1.ConnectGroupListEnhancer, { fetchGroup: fetch_orgGroups, groups: groupReducer.orgGroups, subHeader: "OrgGroups" }),
                        React.createElement(ConnectGroupListEnhancer_1.ConnectGroupListEnhancer, { fetchGroup: fetch_privateGroups, groups: groupReducer.privateGroups, subHeader: "Groups" }),
                        React.createElement(ChatLogsBox_1.ChatLogsBoxEnhancer, { router: history }),
                        React.createElement(SnackbarToolBox_1.SnackbarToolBox, null))),
                React.createElement(AppBody_1.AppBody, { match: match, onError: onError, userReducer: userReducer }),
                React.createElement(ContactBox_1.ContactBox, null))),
        React.createElement("div", { id: "app_footer" },
            React.createElement(StalkComponent_1.StalkCompEnhancer, null)))));
