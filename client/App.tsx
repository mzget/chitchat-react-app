import * as React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { ApolloProvider } from 'react-apollo';
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

import { HomePageWithDialogBox } from "./containers/HomeEnhanced";
import { ForgotAccount } from "./containers/ForgottenAccount";
import { ChatPageEnhanced } from "./containers/ChatPageEnhanced";
import { ChatRoomSettingsEnhanced } from "./containers/ChatRoomSettingsPage";
import { TeamPageEnhanced } from "./containers/TeamPageEnhanced";
import { m_ProfilePageEnhanced } from "./containers/m_ProfilePageEnhanced";
import { MainPageWithDialogBox } from "./containers/Main";
import { M_MainPageEnhanced } from "./containers/m_Main";
import { AdminPageEnhanced } from "./containers/AdminPageEnhanced";
import { VideoCallEnhance } from "./containers/VideoCall";

import { SMALL_TABLET } from "./chitchat/consts/Breakpoints";

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
            <ApolloProvider store={Store} client={apolloClient}>
                <Router>
                    <div id="app">
                        <ReapopNotiBoxWithState />
                        <StalkNotiDialog />
                        <StalkCompEnhancer />
                        <FetchingDialogEnhance />
                        <Switch>
                            <Route path="/" exact component={HomePageWithDialogBox} />
                            <Route path="/forgotaccount" component={ForgotAccount} />
                            <Route path="/profile/:filter/:user" component={(this.clientWidth < SMALL_TABLET) ? m_ProfilePageEnhanced : MainPageWithDialogBox} />
                            <Route path="/teams" component={TeamPageEnhanced} />
                            <Route path="/team/:filter" component={(this.clientWidth < SMALL_TABLET) ? M_MainPageEnhanced : MainPageWithDialogBox} />
                            <Route path="/chatroom/chat/:room_id" component={(this.clientWidth < SMALL_TABLET) ? ChatPageEnhanced : MainPageWithDialogBox} />
                            <Route path="/chatroom/settings/:room_id/:edit" component={(this.clientWidth < SMALL_TABLET) ? ChatRoomSettingsEnhanced : MainPageWithDialogBox} />
                            <Route path="/admin/:menu?/:id?" component={AdminPageEnhanced} />
                            <Route path="/videocall/:id" component={VideoCallEnhance} />
                            <Route component={NoMatch} />
                        </Switch>
                    </div>
                </Router>
            </ApolloProvider>
        );
    }
}
export default App;
