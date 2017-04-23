"use strict";
const React = require("react");
const react_router_dom_1 = require("react-router-dom");
const reflexbox_1 = require("reflexbox");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const ProfileBox_1 = require("./profile/ProfileBox");
const ConnectGroupListEnhancer_1 = require("./group/ConnectGroupListEnhancer");
const ChatLogsBox_1 = require("./chatlog/ChatLogsBox");
const SnackbarToolBox_1 = require("./toolsbox/SnackbarToolBox");
const StalkComponent_1 = require("./stalk/StalkComponent");
const AppBody_1 = require("./AppBody");
const RightNav_1 = require("./RightNav");
const MainPageEnhancer_1 = require("./MainPageEnhancer");
const DialogBoxEnhancer_1 = require("./toolsbox/DialogBoxEnhancer");
const MainPageToolbar_1 = require("./MainPageToolbar");
const DialogBox_1 = require("../components/DialogBox");
const MainPageEnhanced = MainPageEnhancer_1.MainPageEnhancer(({ teamReducer, groupReducer, authReducer, userReducer, history, match, onError, fetch_orgGroups, fetch_privateGroups }) => {
    // console.log(match, history.location); 
    return (React.createElement(MuiThemeProvider_1.default, null,
        React.createElement("div", null,
            React.createElement(MainPageToolbar_1.ToolbarEnhanced, { history: history, teamReducer: teamReducer, authReducer: authReducer, listener: MainPageToolbar_1.listener }),
            React.createElement("div", { id: "app_body", style: { overflowY: "auto" } },
                React.createElement(reflexbox_1.Flex, { flexColumn: false },
                    React.createElement(reflexbox_1.Flex, { flexColumn: true },
                        React.createElement("div", { style: { overflowY: "auto" } },
                            React.createElement(ProfileBox_1.ProfileWithRouter, null),
                            React.createElement(ConnectGroupListEnhancer_1.ConnectGroupListEnhancer, { fetchGroup: fetch_orgGroups, groups: groupReducer.orgGroups, subHeader: "OrgGroups" }),
                            React.createElement(ConnectGroupListEnhancer_1.ConnectGroupListEnhancer, { fetchGroup: fetch_privateGroups, groups: groupReducer.privateGroups, subHeader: "Groups" }),
                            React.createElement(ChatLogsBox_1.ChatLogsBoxEnhancer, { router: history }),
                            React.createElement(SnackbarToolBox_1.SnackbarToolBox, null))),
                    React.createElement(AppBody_1.AppBody, { userReducer: userReducer, match: match, onError: onError }),
                    React.createElement(RightNav_1.RightNav, { match: match, onError: onError }))),
            React.createElement("div", { id: "app_footer" },
                React.createElement(StalkComponent_1.StalkCompEnhancer, null)))));
});
exports.MainPageWithDialogBox = DialogBoxEnhancer_1.DialogBoxEnhancer(({ title, message, open, handleClose, onError, history, match }) => React.createElement("div", null,
    React.createElement(MainPageEnhanced, { onError: onError, history: history, match: match }),
    React.createElement(DialogBox_1.DialogBox, { title: title, message: message, open: open, handleClose: handleClose })));
exports.MainPageWithDialogBox = react_router_dom_1.withRouter(exports.MainPageWithDialogBox);
