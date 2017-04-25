import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { shallowEqual } from "recompose";
import { Flex, Box } from "reflexbox";
import * as immutable from "immutable";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";

import { SimpleToolbar } from "../components/SimpleToolbar";
import { ProfileWithRouter } from "./profile/ProfileBox";
import { ConnectGroupListEnhancer } from "./group/ConnectGroupListEnhancer";
import { ChatLogsBoxEnhancer } from "./chatlog/ChatLogsBox";
import { SnackbarToolBox } from "./toolsbox/SnackbarToolBox";
import { StalkCompEnhancer } from "./stalk/StalkComponent";
import { AppBody } from "./AppBody";
import { RightNav } from "./RightNav";
import { SubToolbar } from "./SubToolbar";

import { ContactBox } from "./chatlist/ContactBox";

import { MainPageEnhancer } from "./Enhancers/MainPageEnhancer";
import { DialogBoxEnhancer } from "./toolsbox/DialogBoxEnhancer";
import { ToolbarEnhanced, listener } from "./MainPageToolbar";
import { DialogBox, IDialoxBoxProps } from "../components/DialogBox";

const MainPageEnhanced = MainPageEnhancer(({ teamReducer, groupReducer, authReducer, userReducer, chatroomReducer,
    history, match, onError, fetch_orgGroups, fetch_privateGroups }) => {
    return (
        <MuiThemeProvider>
            <div >
                <ToolbarEnhanced id={"app_bar"} history={history} teamReducer={teamReducer} authReducer={authReducer} listener={listener} />
                <div id={"app_body"} style={{ position: "relative", height: "calc(100vh - 56px)" }}>
                    <Flex style={{ height: "100%" }}>
                        <Box col={3} style={{ overflowY: "scroll" }}>
                            <ProfileWithRouter />
                            <ConnectGroupListEnhancer
                                fetchGroup={fetch_orgGroups}
                                groups={groupReducer.orgGroups}
                                subHeader={"OrgGroups"} />
                            <ConnectGroupListEnhancer
                                fetchGroup={fetch_privateGroups}
                                groups={groupReducer.privateGroups}
                                subHeader={"Groups"} />
                            <ChatLogsBoxEnhancer />
                            <SnackbarToolBox />
                        </Box>
                        <Box col={9} >
                            <SubToolbar history={history} match={match} onError={onError} chatroomReducer={chatroomReducer} />
                            <Flex>
                                <Box col={6} >
                                    <AppBody userReducer={userReducer} teamReducer={teamReducer} chatroomReducer={chatroomReducer} match={match} onError={onError} />
                                </Box>
                                <Box col={6} >
                                    <RightNav match={match} onError={onError} />
                                </Box>
                            </Flex>
                        </Box>
                    </Flex>
                </div>
                <div id={"app_footer"}>
                    <StalkCompEnhancer />
                </div>
            </div>
        </MuiThemeProvider >
    );
});

export let MainPageWithDialogBox = DialogBoxEnhancer(({ title, message, open, handleClose, onError,
    history, match }: any) =>
    <div>
        <MainPageEnhanced onError={onError} history={history} match={match} />
        <DialogBox
            title={title}
            message={message}
            open={open}
            handleClose={handleClose} />
    </div>
);

MainPageWithDialogBox = withRouter(MainPageWithDialogBox);