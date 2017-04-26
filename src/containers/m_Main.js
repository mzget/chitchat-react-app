"use strict";
const React = require("react");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const ProfileBox_1 = require("./profile/ProfileBox");
const ConnectGroupListEnhancer_1 = require("./group/ConnectGroupListEnhancer");
const ChatLogsBox_1 = require("./chatlog/ChatLogsBox");
const ContactBox_1 = require("./chatlist/ContactBox");
const SnackbarToolBox_1 = require("./toolsbox/SnackbarToolBox");
const StalkComponent_1 = require("./stalk/StalkComponent");
const MainPageEnhancer_1 = require("./Enhancers/MainPageEnhancer");
const MainPageToolbar_1 = require("./MainPageToolbar");
exports.M_MainPageEnhanced = MainPageEnhancer_1.MainPageEnhancer(({ teamReducer, groupReducer, authReducer, history, fetch_orgGroups, fetch_privateGroups }) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement("div", null,
        React.createElement(MainPageToolbar_1.MobileToolbarEnhanced, { history: history, teamReducer: teamReducer, authReducer: authReducer, listener: MainPageToolbar_1.listener }),
        React.createElement("div", { id: "app_body", style: { overflowY: "auto" } },
            React.createElement("div", { style: { overflowY: "auto" } },
                React.createElement(ProfileBox_1.ProfileEnhanced, null),
                React.createElement(ConnectGroupListEnhancer_1.ConnectGroupListEnhancer, { fetchGroup: fetch_orgGroups, groups: groupReducer.orgGroups, subHeader: "OrgGroups" }),
                React.createElement(ConnectGroupListEnhancer_1.ConnectGroupListEnhancer, { fetchGroup: fetch_privateGroups, groups: groupReducer.privateGroups, subHeader: "Groups" }),
                React.createElement(ContactBox_1.ContactBox, null),
                React.createElement(ChatLogsBox_1.ChatLogsBoxEnhancer, null),
                React.createElement(SnackbarToolBox_1.SnackbarToolBox, null))),
        React.createElement("div", { id: "app_footer" },
            React.createElement(StalkComponent_1.StalkCompEnhancer, null))))));
