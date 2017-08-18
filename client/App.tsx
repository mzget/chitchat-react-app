import * as React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { ApolloProvider } from 'react-apollo';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
/**
 * ### configureStore
 *  ```configureStore``` will connect the ```reducers```,
 */
import Store from "./redux/configureStore";
import { apolloClient } from "./redux/rootReducer";

import { chitchatFactory, config } from "./Chitchat";
chitchatFactory.initConfig(config);
chitchatFactory.initStore(Store);
chitchatFactory.initSecureService();
Store.subscribe(() => {
    chitchatFactory.setAuthStore(
        Store.getState().userReducer.user,
        Store.getState().authReducer.token);
    chitchatFactory.setTeamStore({
        team: Store.getState().teamReducer.team,
        members: Store.getState().teamReducer.members
    });
});

import { ReapopNotiBoxWithState } from "./components/NotificationSystem";
import { StalkNotiDialog } from "./containers/stalk/StalkNotiDialog";
import { StalkCompEnhancer } from "./containers/stalk/StalkComponent";
import { FetchingDialogEnhance } from "./containers/toolsbox/FetchingDialog";

import { HomeWithDialogEnhance } from "./containers/Home";
import { ForgotAccount } from "./containers/ForgottenAccount";
import { ChatPageEnhanced } from "./containers/ChatPageEnhanced";
import { ChatRoomSettingsEnhanced } from "./containers/ChatRoomSettingsPage";
import { TeamPageEnhanced } from "./containers/TeamPageEnhanced";
import { m_ProfilePageEnhanced } from "./containers/m_ProfilePageEnhanced";
import { MainPageWithDialog } from "./containers/Main";
import { M_MainPageEnhanced } from "./containers/m_Main";
import { AdminWithDialogEnhance } from "./containers/Admin";
import { VideoCallSample } from "./containers/voip/VideoCallSample";
import { VideoCallPage } from "./containers/voip/VideoCallPage";

import { SMALL_TABLET } from "./chitchat/consts/Breakpoints";
import { defaultMuiTheme } from "./utils/";

const NoMatch = ({ location }) => (
    <div>
        <h3>No match for <code>{location.pathname}</code></h3>
    </div>
);

class App extends React.Component<any, any> {
    clientWidth = document.documentElement.clientWidth;

    render() {
        // <Switch>
        //     <Route path="/" exact component={Home} />
        //     <Redirect from="/old-match" to="/will-match" />
        //     <Route path="/will-match" component={WillMatch} />
        //     <Route component={NoMatch} />
        // </Switch>

        return (
            <MuiThemeProvider muiTheme={defaultMuiTheme}>
                <ApolloProvider store={Store} client={apolloClient}>
                    <Router>
                        <div id="app">
                            <ReapopNotiBoxWithState />
                            <StalkNotiDialog />
                            <StalkCompEnhancer />
                            <FetchingDialogEnhance />

                            <Switch>
                                <Route path="/" exact component={HomeWithDialogEnhance} />
                                <Route path="/forgotaccount" component={ForgotAccount} />
                                <Route path="/profile/:filter/:user" component={(this.clientWidth < SMALL_TABLET) ? m_ProfilePageEnhanced : MainPageWithDialog} />
                                <Route path="/teams" component={TeamPageEnhanced} />
                                <Route path="/team/:filter" component={(this.clientWidth < SMALL_TABLET) ? M_MainPageEnhanced : MainPageWithDialog} />
                                <Route path="/chatroom/chat/:room_id" component={(this.clientWidth < SMALL_TABLET) ? ChatPageEnhanced : MainPageWithDialog} />
                                <Route path="/chatroom/settings/:room_id/:edit" component={(this.clientWidth < SMALL_TABLET) ? ChatRoomSettingsEnhanced : MainPageWithDialog} />
                                <Route path="/admin/:menu?/:id?" component={AdminWithDialogEnhance} />
                                <Route path="/groupcall/:id" component={VideoCallSample} />
                                <Route path="/videocall/:id" component={VideoCallPage} />
                                <Route component={NoMatch} />
                            </Switch>
                        </div>
                    </Router>
                </ApolloProvider>
            </MuiThemeProvider >
        );
    }
}
export default App;
