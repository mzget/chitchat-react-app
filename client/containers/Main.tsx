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
import { SubToolbar } from "./SubToolbar";

import { ContactBox } from "./chatlist/ContactBox";

import { MainPageEnhancer } from "./Enhancers/MainPageEnhancer";
import { DialogBoxEnhancer } from "./toolsbox/DialogBoxEnhancer";
import { WebToolbarEnhanced, listener } from "./MainPageToolbar";
import { DialogBox, IDialoxBoxProps } from "../components/DialogBox";

const MainPageEnhanced = MainPageEnhancer(({ teamReducer, groupReducer, authReducer, userReducer, chatroomReducer,
    history, match, onError, fetch_orgGroups, fetch_privateGroups }) => {
    return (
        <MuiThemeProvider>
            <Flexbox flexDirection="column" minHeight="100vh">
                <Flexbox element="header" maxHeight="56px">
                    <div style={{ width: "100%" }}>
                        <WebToolbarEnhanced id={"app_bar"} history={history} teamReducer={teamReducer} authReducer={authReducer} listener={listener} />
                    </div>
                </Flexbox>
                <Flexbox element="footer" maxHeight="40px">
                    <StalkCompEnhancer />
                </Flexbox>
                <Flexbox flexDirection="row" flexGrow={1} height="calc(100vh - 56px - 40px)">
                    <Flexbox flexDirection="column" flexGrow={0.3} style={{ overflowY: "scroll" }}>
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
                    <Flexbox flexDirection="column" flexGrow={0.7}>
                        <SubToolbar history={history} match={match} onError={onError}
                            chatroomReducer={chatroomReducer}
                            userReducer={userReducer} />
                        <Flexbox style={{ overflowY: "scroll" }}>
                            <Flexbox flexGrow={0.5}>
                                <div style={{ width: "100%", height: "100%" }}>
                                    <AppBody userReducer={userReducer} match={match} history={history} onError={onError} />
                                </div>
                            </Flexbox>
                            <Flexbox flexGrow={0.5}>
                                <div style={{ width: "100%", height: "100%" }}>
                                    <RightNav match={match} onError={onError} teamReducer={teamReducer} />
                                </div>
                            </Flexbox>
                        </Flexbox>
                    </Flexbox>
                </Flexbox>
            </Flexbox>
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