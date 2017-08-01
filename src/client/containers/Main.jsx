import * as React from "react";
import { withRouter } from "react-router-dom";
import Flexbox from 'flexbox-react';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import { ConnectGroupListEnhancer } from "./group/ConnectGroupListEnhancer";
import { ChatLogsBoxEnhancer } from "./chatlog/ChatLogsBox";
import { AppBody } from "./AppBody";
import { RightNav } from "./RightNav";
import { SubToolbarEnhance } from "./SubToolbar";
import { MainPageEnhancer } from "./Enhancers/MainPageEnhancer";
import { DialogBoxEnhancer } from "./toolsbox/DialogBoxEnhancer";
import { WebToolbarEnhanced, listener } from "./MainPageToolbar";
import { DialogBox } from "../components/DialogBox";
import { ChatTabs } from "../components/ChatTabs";
import { small_body_width, large_body_width, LARGE_TABLET, xsmall_body_width } from '../chitchat/consts/Breakpoints';
import { defaultMuiTheme } from "../utils/";
export const Main = ({ userReducer, teamReducer, authReducer, groupReducer, chatroomReducer, match, history, onError, fetch_orgGroups, fetch_privateGroups }) => (<MuiThemeProvider muiTheme={defaultMuiTheme}>
        <Flexbox flexDirection="column" minHeight="100vh">
            <Flexbox element="header" maxHeight="56px">
                <div id={"app_bar"} style={{ width: "100%", position: 'fixed', zIndex: 99 }}>
                    <WebToolbarEnhanced history={history} teamReducer={teamReducer} authReducer={authReducer} listener={listener}/>
                </div>
            </Flexbox>
            <Flexbox flexDirection="row" justifyContent="center" style={{ backgroundColor: Colors.blueGrey50, marginTop: "56px", overflow: "scroll" }}>
                <Flexbox flexDirection="column" justifyContent="center">
                    <Flexbox maxHeight="40px">
                    </Flexbox>
                    <Flexbox flexDirection="row" flexGrow={1} height="calc(100vh - 56px)">
                        <Flexbox flexDirection="column" flexGrow={0.3} minWidth="280px" width={window.innerWidth >= LARGE_TABLET ? small_body_width : xsmall_body_width} style={{ overflowY: "auto", backgroundColor: Colors.darkWhite }}>
                            <ChatTabs groupComp={<div style={{ height: "calc(100vh - 56px)" }}>
                                        <ConnectGroupListEnhancer fetchGroup={fetch_orgGroups} groups={groupReducer.orgGroups} subHeader={"OrgGroups"}/>
                                        <ConnectGroupListEnhancer fetchGroup={fetch_privateGroups} groups={groupReducer.privateGroups} subHeader={"Groups"}/>
                                    </div>} chatlogs={<ChatLogsBoxEnhancer />}/>
                        </Flexbox>
                        <Flexbox flexDirection="column" flexGrow={0.7}>
                            <SubToolbarEnhance onError={onError}/>
                            <Flexbox height="calc(100vh - 56px)">
                                <Flexbox width={window.innerWidth >= LARGE_TABLET ? large_body_width : small_body_width}>
                                    <div style={{ width: "100%", backgroundColor: Colors.darkWhite }}>
                                        <AppBody userReducer={userReducer} match={match} history={history} onError={onError}/>
                                    </div>
                                </Flexbox>
                                <Flexbox minWidth="280px" width={window.innerWidth >= LARGE_TABLET ? small_body_width : xsmall_body_width}>
                                    <div style={{ width: "100%", backgroundColor: Colors.darkWhite, overflowY: "auto" }}>
                                        <RightNav match={match} onError={onError}/>
                                    </div>
                                </Flexbox>
                            </Flexbox>
                        </Flexbox>
                    </Flexbox>
                </Flexbox>
            </Flexbox>
        </Flexbox>
    </MuiThemeProvider>);
const MainPageEnhanced = MainPageEnhancer(({ teamReducer, groupReducer, authReducer, userReducer, chatroomReducer, history, match, onError, fetch_orgGroups, fetch_privateGroups }) => {
    return (<Main userReducer={userReducer} teamReducer={teamReducer} authReducer={authReducer} groupReducer={groupReducer} chatroomReducer={chatroomReducer} match={match} history={history} onError={onError} fetch_orgGroups={fetch_orgGroups} fetch_privateGroups={fetch_privateGroups}/>);
});
export var MainPageWithDialogBox = DialogBoxEnhancer(({ title, message, open, handleClose, onError, history, match }) => <div>
        <MainPageEnhanced onError={onError} history={history} match={match}/>
        <DialogBox title={title} message={message} open={open} handleClose={handleClose}/>
    </div>);
MainPageWithDialogBox = withRouter(MainPageWithDialogBox);
