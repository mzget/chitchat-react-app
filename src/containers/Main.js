"use strict";
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var flexbox_react_1 = require("flexbox-react");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Colors = require("material-ui/styles/colors");
var ConnectGroupListEnhancer_1 = require("./group/ConnectGroupListEnhancer");
var ChatLogsBox_1 = require("./chatlog/ChatLogsBox");
var StalkComponent_1 = require("./stalk/StalkComponent");
var AppBody_1 = require("./AppBody");
var RightNav_1 = require("./RightNav");
var SubToolbar_1 = require("./SubToolbar");
var MainPageEnhancer_1 = require("./Enhancers/MainPageEnhancer");
var DialogBoxEnhancer_1 = require("./toolsbox/DialogBoxEnhancer");
var MainPageToolbar_1 = require("./MainPageToolbar");
var DialogBox_1 = require("../components/DialogBox");
var MainPageEnhanced = MainPageEnhancer_1.MainPageEnhancer(function (_a) {
    var teamReducer = _a.teamReducer, groupReducer = _a.groupReducer, authReducer = _a.authReducer, userReducer = _a.userReducer, chatroomReducer = _a.chatroomReducer, history = _a.history, match = _a.match, onError = _a.onError, fetch_orgGroups = _a.fetch_orgGroups, fetch_privateGroups = _a.fetch_privateGroups;
    return (React.createElement(MuiThemeProvider_1["default"], null,
        React.createElement(flexbox_react_1["default"], { flexDirection: "column", minHeight: "100vh" },
            React.createElement(flexbox_react_1["default"], { element: "header", maxHeight: "56px" },
                React.createElement("div", { id: "app_bar", style: { width: "100%" } },
                    React.createElement(MainPageToolbar_1.WebToolbarEnhanced, { history: history, teamReducer: teamReducer, authReducer: authReducer, listener: MainPageToolbar_1.listener }))),
            React.createElement(flexbox_react_1["default"], { flexDirection: "row", justifyContent: "center", style: { backgroundColor: Colors.blueGrey50 } },
                React.createElement(flexbox_react_1["default"], { flexDirection: "column", justifyContent: "center" },
                    React.createElement(flexbox_react_1["default"], { maxHeight: "40px" },
                        React.createElement(StalkComponent_1.StalkCompEnhancer, null)),
                    React.createElement(flexbox_react_1["default"], { flexDirection: "row", flexGrow: 1, height: "calc(100vh - 56px)" },
                        React.createElement(flexbox_react_1["default"], { flexDirection: "column", flexGrow: 0.3, style: { overflowY: "scroll", backgroundColor: Colors.darkWhite } },
                            React.createElement(ConnectGroupListEnhancer_1.ConnectGroupListEnhancer, { fetchGroup: fetch_orgGroups, groups: groupReducer.orgGroups, subHeader: "OrgGroups" }),
                            React.createElement(ConnectGroupListEnhancer_1.ConnectGroupListEnhancer, { fetchGroup: fetch_privateGroups, groups: groupReducer.privateGroups, subHeader: "Groups" }),
                            React.createElement(ChatLogsBox_1.ChatLogsBoxEnhancer, null)),
                        React.createElement(flexbox_react_1["default"], { flexDirection: "column", flexGrow: 0.7 },
                            React.createElement(SubToolbar_1.SubToolbar, { history: history, match: match, onError: onError, chatroomReducer: chatroomReducer, userReducer: userReducer }),
                            React.createElement(flexbox_react_1["default"], { style: { overflowY: "scroll" }, height: "calc(100vh - 56px)" },
                                React.createElement(flexbox_react_1["default"], { width: "400px" },
                                    React.createElement("div", { style: { width: "100%", backgroundColor: Colors.darkWhite } },
                                        React.createElement(AppBody_1.AppBody, { userReducer: userReducer, match: match, history: history, onError: onError }))),
                                React.createElement(flexbox_react_1["default"], { width: "288px" },
                                    React.createElement("div", { style: { width: "100%", backgroundColor: Colors.darkWhite } },
                                        React.createElement(RightNav_1.RightNav, { match: match, onError: onError, teamReducer: teamReducer })))))))))));
});
exports.MainPageWithDialogBox = DialogBoxEnhancer_1.DialogBoxEnhancer(function (_a) {
    var title = _a.title, message = _a.message, open = _a.open, handleClose = _a.handleClose, onError = _a.onError, history = _a.history, match = _a.match;
    return React.createElement("div", null,
        React.createElement(MainPageEnhanced, { onError: onError, history: history, match: match }),
        React.createElement(DialogBox_1.DialogBox, { title: title, message: message, open: open, handleClose: handleClose }));
});
exports.MainPageWithDialogBox = react_router_dom_1.withRouter(exports.MainPageWithDialogBox);
