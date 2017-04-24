import * as React from "react";
import { connect } from "react-redux";
import { shallowEqual, compose, withHandlers, withState, lifecycle } from "recompose";
import { Flex, Box } from "reflexbox";
import * as immutable from "immutable";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";

import { ProfileWithRouter } from "./profile/ProfileBox";
import { ConnectGroupListEnhancer } from "./group/ConnectGroupListEnhancer";
import { ChatLogsBoxEnhancer } from "./chatlog/ChatLogsBox";
import { ContactBox } from "./chatlist/ContactBox";
import { SnackbarToolBox } from "./toolsbox/SnackbarToolBox";
import { StalkCompEnhancer } from "./stalk/StalkComponent";
import { MainPageEnhancer } from "./Enhancers/MainPageEnhancer";
import { ToolbarEnhanced, listener } from "./MainPageToolbar";

export const M_MainPageEnhanced = MainPageEnhancer(({ teamReducer, groupReducer, authReducer, history, fetch_orgGroups, fetch_privateGroups }: any) => (
    <MuiThemeProvider>
        <div >
            <ToolbarEnhanced history={history} teamReducer={teamReducer} authReducer={authReducer} listener={listener} />
            <div id={"app_body"} style={{ overflowY: "auto" }}>
                <div style={{ overflowY: "auto" }}>
                    <ProfileWithRouter />
                    <ConnectGroupListEnhancer fetchGroup={fetch_orgGroups}
                        groups={groupReducer.orgGroups}
                        subHeader={"OrgGroups"} />
                    <ConnectGroupListEnhancer
                        fetchGroup={fetch_privateGroups}
                        groups={groupReducer.privateGroups}
                        subHeader={"Groups"} />
                    <ContactBox />
                    <ChatLogsBoxEnhancer />
                    <SnackbarToolBox />
                </div>
            </div>
            <div id={"app_footer"} >
                <StalkCompEnhancer />
            </div>
        </div>
    </MuiThemeProvider >
));
