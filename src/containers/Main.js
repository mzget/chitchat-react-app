"use strict";
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var reflexbox_1 = require("reflexbox");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var ConnectGroupListEnhancer_1 = require("./group/ConnectGroupListEnhancer");
var ChatLogsBox_1 = require("./chatlog/ChatLogsBox");
var SnackbarToolBox_1 = require("./toolsbox/SnackbarToolBox");
var StalkComponent_1 = require("./stalk/StalkComponent");
var AppBody_1 = require("./AppBody");
var RightNav_1 = require("./RightNav");
var SubToolbar_1 = require("./SubToolbar");
var MainPageEnhancer_1 = require("./Enhancers/MainPageEnhancer");
var DialogBoxEnhancer_1 = require("./toolsbox/DialogBoxEnhancer");
var MainPageToolbar_1 = require("./MainPageToolbar");
var DialogBox_1 = require("../components/DialogBox");
var NotificationSystem_1 = require("../components/NotificationSystem");
var MainPageEnhanced = MainPageEnhancer_1.MainPageEnhancer(function (_a) {
    var teamReducer = _a.teamReducer, groupReducer = _a.groupReducer, authReducer = _a.authReducer, userReducer = _a.userReducer, chatroomReducer = _a.chatroomReducer, history = _a.history, match = _a.match, onError = _a.onError, fetch_orgGroups = _a.fetch_orgGroups, fetch_privateGroups = _a.fetch_privateGroups;
    return (React.createElement(MuiThemeProvider_1["default"], null,
        React.createElement("div", null,
            React.createElement(MainPageToolbar_1.WebToolbarEnhanced, { id: "app_bar", history: history, teamReducer: teamReducer, authReducer: authReducer, listener: MainPageToolbar_1.listener }),
            React.createElement("div", { id: "app_body", style: { position: "relative", height: "calc(100vh - 56px)", overflowY: "hidden" } },
                React.createElement(reflexbox_1.Flex, { style: { height: "100%" } },
                    React.createElement(reflexbox_1.Box, { col: 3, style: { overflowY: "scroll" } },
                        React.createElement(ConnectGroupListEnhancer_1.ConnectGroupListEnhancer, { fetchGroup: fetch_orgGroups, groups: groupReducer.orgGroups, subHeader: "OrgGroups" }),
                        React.createElement(ConnectGroupListEnhancer_1.ConnectGroupListEnhancer, { fetchGroup: fetch_privateGroups, groups: groupReducer.privateGroups, subHeader: "Groups" }),
                        React.createElement(ChatLogsBox_1.ChatLogsBoxEnhancer, null),
                        React.createElement(SnackbarToolBox_1.SnackbarToolBox, null)),
                    React.createElement(reflexbox_1.Box, { col: 9 },
                        React.createElement(SubToolbar_1.SubToolbar, { history: history, match: match, onError: onError, chatroomReducer: chatroomReducer, userReducer: userReducer }),
                        React.createElement(reflexbox_1.Flex, null,
                            React.createElement(reflexbox_1.Box, { col: 8 },
                                React.createElement(AppBody_1.AppBody, { userReducer: userReducer, match: match, history: history, onError: onError })),
                            React.createElement(reflexbox_1.Box, { col: 4 },
                                React.createElement(RightNav_1.RightNav, { match: match, onError: onError, teamReducer: teamReducer }))))),
                React.createElement("div", { id: "app_footer" },
                    React.createElement(StalkComponent_1.StalkCompEnhancer, null))))));
});
exports.MainPageWithDialogBox = DialogBoxEnhancer_1.DialogBoxEnhancer(function (_a) {
    var title = _a.title, message = _a.message, open = _a.open, handleClose = _a.handleClose, onError = _a.onError, history = _a.history, match = _a.match;
    return React.createElement("div", null,
        React.createElement(NotificationSystem_1.ReapopComponent, null),
        React.createElement(MainPageEnhanced, { onError: onError, history: history, match: match }),
        React.createElement(DialogBox_1.DialogBox, { title: title, message: message, open: open, handleClose: handleClose }));
});
exports.MainPageWithDialogBox = react_router_dom_1.withRouter(exports.MainPageWithDialogBox);
