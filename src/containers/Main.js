import * as React from "react";
import { withRouter } from "react-router-dom";
import Flexbox from 'flexbox-react';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import { ConnectGroupListEnhancer } from "./group/ConnectGroupListEnhancer";
import { ChatLogsBoxEnhancer } from "./chatlog/ChatLogsBox";
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
        React.createElement(Flexbox, { flexDirection: "column", minHeight: "100vh" },
            React.createElement(Flexbox, { element: "header", maxHeight: "56px" },
                React.createElement("div", { id: "app_bar", style: { width: "100%" } },
                    React.createElement(WebToolbarEnhanced, { history: history, teamReducer: teamReducer, authReducer: authReducer, listener: listener }))),
            React.createElement(Flexbox, { flexDirection: "row", justifyContent: "center", style: { backgroundColor: Colors.blueGrey50 } },
                React.createElement(Flexbox, { flexDirection: "column", justifyContent: "center" },
                    React.createElement(Flexbox, { maxHeight: "40px" },
                        React.createElement(StalkCompEnhancer, null)),
                    React.createElement(Flexbox, { flexDirection: "row", flexGrow: 1, height: "calc(100vh - 56px)" },
                        React.createElement(Flexbox, { flexDirection: "column", flexGrow: 0.3, minWidth: "280px", style: { overflowY: "auto", backgroundColor: Colors.darkWhite } },
                            React.createElement(ConnectGroupListEnhancer, { fetchGroup: fetch_orgGroups, groups: groupReducer.orgGroups, subHeader: "OrgGroups" }),
                            React.createElement(ConnectGroupListEnhancer, { fetchGroup: fetch_privateGroups, groups: groupReducer.privateGroups, subHeader: "Groups" }),
                            React.createElement(ChatLogsBoxEnhancer, null)),
                        React.createElement(Flexbox, { flexDirection: "column", flexGrow: 0.7 },
                            React.createElement(SubToolbar, { history: history, match: match, onError: onError, chatroomReducer: chatroomReducer, userReducer: userReducer }),
                            React.createElement(Flexbox, { height: "calc(100vh - 56px)" },
                                React.createElement(Flexbox, { width: "400px" },
                                    React.createElement("div", { style: { width: "100%", backgroundColor: Colors.darkWhite } },
                                        React.createElement(AppBody, { userReducer: userReducer, match: match, history: history, onError: onError }))),
                                React.createElement(Flexbox, { minWidth: "280px" },
                                    React.createElement("div", { style: { width: "100%", backgroundColor: Colors.darkWhite } },
                                        React.createElement(RightNav, { match: match, onError: onError, teamReducer: teamReducer })))))))))));
});
export let MainPageWithDialogBox = DialogBoxEnhancer(({ title, message, open, handleClose, onError, history, match }) => React.createElement("div", null,
    React.createElement(MainPageEnhanced, { onError: onError, history: history, match: match }),
    React.createElement(DialogBox, { title: title, message: message, open: open, handleClose: handleClose })));
MainPageWithDialogBox = withRouter(MainPageWithDialogBox);
