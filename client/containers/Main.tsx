import * as React from "react";
import { connect } from "react-redux";
import { shallowEqual } from "recompose";
import { Flex, Box } from "reflexbox";
import * as immutable from "immutable";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";

import { SimpleToolbar } from "../components/SimpleToolbar";
import { ProfileEnhancer } from "./profile/ProfileBox";
import { ConnectGroupListEnhancer } from "./group/ConnectGroupListEnhancer";
import { ChatLogsBoxEnhancer } from "./chatlog/ChatLogsBox";
import { ContactBox } from "./chatlist/ContactBox";
import { SnackbarToolBox } from "./toolsbox/SnackbarToolBox";
import { StalkCompEnhancer } from "./stalk/StalkComponent";
import { AppBody } from "./AppBody";
import { MainPageEnhancer } from "./MainPageEnhancer";
import { ToolbarEnhanced, listener } from "./MainPageToolbar";

export const MainPageEnhanced = MainPageEnhancer(({ teamReducer, groupReducer, authReducer, userReducer, history, match, onError, fetch_orgGroups, fetch_privateGroups }: any) =>
    <MuiThemeProvider>
        <div >
            <ToolbarEnhanced history={history} teamReducer={teamReducer} authReducer={authReducer} listener={listener} />
            <div id={"app_body"} style={{ overflowY: "auto" }}>
                <Flex flexColumn={false}>
                    <Flex flexColumn={true}>
                        <div style={{ overflowY: "auto" }}>
                            <ProfileEnhancer router={history} />
                            <ConnectGroupListEnhancer fetchGroup={fetch_orgGroups}
                                groups={groupReducer.orgGroups}
                                subHeader={"OrgGroups"} />
                            <ConnectGroupListEnhancer
                                fetchGroup={fetch_privateGroups}
                                groups={groupReducer.privateGroups}
                                subHeader={"Groups"} />
                            <ChatLogsBoxEnhancer router={history} />
                            <SnackbarToolBox />
                        </div>
                    </Flex>
                    <AppBody match={match} onError={onError} userReducer={userReducer} />
                    <ContactBox />
                </Flex>
            </div>
            <div id={"app_footer"}>
                <StalkCompEnhancer />
            </div>
        </div>
    </MuiThemeProvider >
);
