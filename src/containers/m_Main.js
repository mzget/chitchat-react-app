"use strict";
var React = require("react");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var ProfileBox_1 = require("./profile/ProfileBox");
var ConnectGroupListEnhancer_1 = require("./group/ConnectGroupListEnhancer");
var ChatLogsBox_1 = require("./chatlog/ChatLogsBox");
var ContactBox_1 = require("./chatlist/ContactBox");
var SnackbarToolBox_1 = require("./toolsbox/SnackbarToolBox");
var StalkComponent_1 = require("./stalk/StalkComponent");
var MainPageEnhancer_1 = require("./Enhancers/MainPageEnhancer");
var MainPageToolbar_1 = require("./MainPageToolbar");
exports.M_MainPageEnhanced = MainPageEnhancer_1.MainPageEnhancer(function (_a) {
    var teamReducer = _a.teamReducer, groupReducer = _a.groupReducer, authReducer = _a.authReducer, history = _a.history, fetch_orgGroups = _a.fetch_orgGroups, fetch_privateGroups = _a.fetch_privateGroups;
    return (React.createElement(MuiThemeProvider_1["default"], null,
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
                React.createElement(StalkComponent_1.StalkCompEnhancer, null)))));
});
