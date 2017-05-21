import * as React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { ProfileEnhanced } from "./profile/ProfileBox";
import { ConnectGroupListEnhancer } from "./group/ConnectGroupListEnhancer";
import { ChatLogsBoxEnhancer } from "./chatlog/ChatLogsBox";
import { ContactBox } from "./chatlist/ContactBox";
import { SnackbarToolBox } from "./toolsbox/SnackbarToolBox";
import { StalkCompEnhancer } from "./stalk/StalkComponent";
import { MainPageEnhancer } from "./Enhancers/MainPageEnhancer";
import { MobileToolbarEnhanced, listener } from "./MainPageToolbar";
export const M_MainPageEnhanced = MainPageEnhancer(({ teamReducer, groupReducer, authReducer, history, fetch_orgGroups, fetch_privateGroups }) => (React.createElement(MuiThemeProvider, null,
    React.createElement("div", null,
        React.createElement(MobileToolbarEnhanced, { history: history, teamReducer: teamReducer, authReducer: authReducer, listener: listener }),
        React.createElement("div", { id: "app_body", style: { overflowY: "auto" } },
            React.createElement("div", { style: { overflowY: "auto" } },
                React.createElement(ProfileEnhanced, null),
                React.createElement(ConnectGroupListEnhancer, { fetchGroup: fetch_orgGroups, groups: groupReducer.orgGroups, subHeader: "OrgGroups" }),
                React.createElement(ConnectGroupListEnhancer, { fetchGroup: fetch_privateGroups, groups: groupReducer.privateGroups, subHeader: "Groups" }),
                React.createElement(ContactBox, null),
                React.createElement(ChatLogsBoxEnhancer, null),
                React.createElement(SnackbarToolBox, null))),
        React.createElement("div", { id: "app_footer" },
            React.createElement(StalkCompEnhancer, null))))));
