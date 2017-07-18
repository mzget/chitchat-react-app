import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { shallowEqual } from "recompose";
import Flexbox from 'flexbox-react';
import * as immutable from "immutable";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";

import { SimpleToolbar } from "../components/SimpleToolbar";
import { ConnectGroupListEnhancer } from "./group/ConnectGroupListEnhancer";
import { ChatLogsBoxEnhancer } from "./chatlog/ChatLogsBox";
import { StalkCompEnhancer } from "./stalk/StalkComponent";
import { AppBody } from "./AppBody";
import { RightNav } from "./RightNav";
import { SubToolbarEnhance } from "./SubToolbar";

import { ContactBox } from "./chatlist/ContactBox";

import { MainPageEnhancer } from "./Enhancers/MainPageEnhancer";
import { DialogBoxEnhancer } from "./toolsbox/DialogBoxEnhancer";
import { WebToolbarEnhanced, listener } from "./MainPageToolbar";
import { DialogBox, IDialoxBoxProps } from "../components/DialogBox";

export const Main = ({ userReducer, teamReducer, authReducer, groupReducer, chatroomReducer, match, history, onError, fetch_orgGroups, fetch_privateGroups }) => (
    <MuiThemeProvider>
        <Flexbox flexDirection="column" minHeight="100vh">
            <Flexbox element="header" maxHeight="56px">
                <div id={"app_bar"} style={{ width: "100%" }}>
                    <WebToolbarEnhanced history={history} teamReducer={teamReducer} authReducer={authReducer} listener={listener} />
                </div>
            </Flexbox>
            <Flexbox flexDirection="row" justifyContent="center" style={{ backgroundColor: Colors.blueGrey50 }}>
                <Flexbox flexDirection="column" justifyContent="center">
                    <Flexbox maxHeight="40px">
                        <StalkCompEnhancer />
                    </Flexbox>
                    <Flexbox flexDirection="row" flexGrow={1} height="calc(100vh - 56px)">
                        <Flexbox flexDirection="column" flexGrow={0.3} minWidth="280px" maxWidth={"280px"}
                            style={{ overflowY: "auto", backgroundColor: Colors.darkWhite }}>
                            <ConnectGroupListEnhancer
                                fetchGroup={fetch_orgGroups}
                                groups={groupReducer.orgGroups}
                                subHeader={"OrgGroups"} />
                            <ConnectGroupListEnhancer
                                fetchGroup={fetch_privateGroups}
                                groups={groupReducer.privateGroups}
                                subHeader={"Groups"} />
                            <ChatLogsBoxEnhancer />
                        </Flexbox>
                        <Flexbox flexDirection="column" flexGrow={0.7} >
                            <SubToolbarEnhance onError={onError} />
                            <Flexbox height="calc(100vh - 56px)" >
                                <Flexbox width="400px" >
                                    <div style={{ width: "100%", backgroundColor: Colors.darkWhite }}>
                                        <AppBody userReducer={userReducer} match={match} history={history} onError={onError} />
                                    </div>
                                </Flexbox>
                                <Flexbox minWidth="280px" maxWidth={"280px"} >
                                    <div style={{ width: "100%", backgroundColor: Colors.darkWhite }}>
                                        <RightNav
                                            match={match}
                                            onError={onError}
                                            teamReducer={teamReducer} />
                                    </div>
                                </Flexbox>
                            </Flexbox>
                        </Flexbox>
                    </Flexbox>
                </Flexbox>
            </Flexbox>
        </Flexbox>
    </MuiThemeProvider >
);

const MainPageEnhanced = MainPageEnhancer(({ teamReducer, groupReducer, authReducer, userReducer, chatroomReducer, history, match, onError, fetch_orgGroups, fetch_privateGroups }) => {
    return (
        <Main
            userReducer={userReducer}
            teamReducer={teamReducer}
            authReducer={authReducer}
            groupReducer={groupReducer}
            chatroomReducer={chatroomReducer}
            match={match}
            history={history}
            onError={onError}
            fetch_orgGroups={fetch_orgGroups}
            fetch_privateGroups={fetch_privateGroups}
        />
    );
});

export var MainPageWithDialogBox = DialogBoxEnhancer(({ title, message, open, handleClose, onError, history, match }: any) =>
    <div>
        <MainPageEnhanced onError={onError} history={history} match={match} />
        <DialogBox title={title} message={message} open={open} handleClose={handleClose} />
    </div>
);

MainPageWithDialogBox = withRouter(MainPageWithDialogBox);