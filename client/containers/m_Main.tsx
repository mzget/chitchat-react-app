﻿import * as React from "react";
import { connect } from "react-redux";
import { shallowEqual, compose, withHandlers, withState, lifecycle } from "recompose";
import * as immutable from "immutable";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";

import { ProfileEnhanced } from "./profile/ProfileBox";
import { ConnectGroupListEnhancer } from "./group/ConnectGroupListEnhancer";
import { ChatLogsBoxEnhancer } from "./chatlog/ChatLogsBox";
import { ContactBox } from "./chatlist/ContactBox";
import { SnackbarToolBox } from "./toolsbox/SnackbarToolBox";
import { MainPageEnhancer } from "./Enhancers/MainPageEnhancer";
import { MobileToolbarEnhanced, listener } from "./MainPageToolbar";

export const M_MainPageEnhanced = MainPageEnhancer(({ teamReducer, groupReducer, authReducer, history, fetch_orgGroups, fetch_privateGroups }: any) => (
    <MuiThemeProvider>
        <div >
            <MobileToolbarEnhanced
                history={history}
                teamReducer={teamReducer}
                authReducer={authReducer}
                listener={listener}
            />
            <div id={"app_body"} style={{ overflowY: "auto" }}>
                <div style={{ overflowY: "auto" }}>
                    <ProfileEnhanced />
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
        </div>
    </MuiThemeProvider >
));
