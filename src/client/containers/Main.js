import * as React from "react";
import { withRouter } from "react-router-dom";
import { Flex, Box } from "reflexbox";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { ConnectGroupListEnhancer } from "./group/ConnectGroupListEnhancer";
import { ChatLogsBoxEnhancer } from "./chatlog/ChatLogsBox";
import { SnackbarToolBox } from "./toolsbox/SnackbarToolBox";
import { StalkCompEnhancer } from "./stalk/StalkComponent";
import { AppBody } from "./AppBody";
import { RightNav } from "./RightNav";
import { SubToolbar } from "./SubToolbar";
import { MainPageEnhancer } from "./Enhancers/MainPageEnhancer";
import { DialogBoxEnhancer } from "./toolsbox/DialogBoxEnhancer";
import { WebToolbarEnhanced, listener } from "./MainPageToolbar";
import { DialogBox } from "../components/DialogBox";
const MainPageEnhanced = MainPageEnhancer(({ teamReducer, groupReducer, authReducer, userReducer, chatroomReducer, history, match, onError, fetch_orgGroups, fetch_privateGroups }) => {
    return (React.createElement(MuiThemeProvider, null,
        React.createElement("div", null,
            React.createElement(WebToolbarEnhanced, { id: "app_bar", history: history, teamReducer: teamReducer, authReducer: authReducer, listener: listener }),
            React.createElement("div", { id: "app_body", style: { position: "relative", height: "calc(100vh - 56px)", overflowY: "hidden" } },
                React.createElement(Flex, { style: { height: "100%" } },
                    React.createElement(Box, { col: 3, style: { overflowY: "scroll" } },
                        React.createElement(ConnectGroupListEnhancer, { fetchGroup: fetch_orgGroups, groups: groupReducer.orgGroups, subHeader: "OrgGroups" }),
                        React.createElement(ConnectGroupListEnhancer, { fetchGroup: fetch_privateGroups, groups: groupReducer.privateGroups, subHeader: "Groups" }),
                        React.createElement(ChatLogsBoxEnhancer, null),
                        React.createElement(SnackbarToolBox, null)),
                    React.createElement(Box, { col: 9 },
                        React.createElement(SubToolbar, { history: history, match: match, onError: onError, chatroomReducer: chatroomReducer, userReducer: userReducer }),
                        React.createElement(Flex, null,
                            React.createElement(Box, { col: 8 },
                                React.createElement(AppBody, { userReducer: userReducer, match: match, history: history, onError: onError })),
                            React.createElement(Box, { col: 4 },
                                React.createElement(RightNav, { match: match, onError: onError, teamReducer: teamReducer }))))),
                React.createElement("div", { id: "app_footer" },
                    React.createElement(StalkCompEnhancer, null))))));
});
export let MainPageWithDialogBox = DialogBoxEnhancer(({ title, message, open, handleClose, onError, history, match }) => React.createElement("div", null,
    React.createElement(MainPageEnhanced, { onError: onError, history: history, match: match }),
    React.createElement(DialogBox, { title: title, message: message, open: open, handleClose: handleClose })));
MainPageWithDialogBox = withRouter(MainPageWithDialogBox);
