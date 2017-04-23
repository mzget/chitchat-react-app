import * as React from "react";
import { Provider } from "react-redux";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch
} from "react-router-dom";

import { chitchatFactory } from "./chitchat";
/**
 * ### configureStore
 *  ```configureStore``` will connect the ```reducers```,
 */
import Store from "./redux/configureStore";

import { HomePageWithDialogBox } from "./containers/HomeEnhanced";
import { ChatPageEnhanced } from "./containers/ChatPageEnhanced";
import ChatRoomSettings from "./containers/ChatRoomSettings";
import Team from "./containers/Team";
import { ProfilePageEnhanced } from "./containers/ProfilePageEnhanced";
import { MainPageWithDialogBox } from "./containers/Main";
import { M_MainPageEnhanced } from "./containers/m_Main";
import { AdminPageEnhanced } from "./containers/AdminPageEnhanced";

import { SMALL_TABLET } from "./chitchat/consts/Breakpoints";

chitchatFactory.initStore(Store);
Store.subscribe(() => {
    chitchatFactory.setAuthStore(Store.getState().userReducer.user, Store.getState().authReducer.token);
    chitchatFactory.setTeamStore({
        team: Store.getState().teamReducer.team,
        members: Store.getState().teamReducer.members
    });
});

class App extends React.Component<any, any> {
    clientWidth = document.documentElement.clientWidth;

    render() {
        return (
            <Provider store={Store}>
                <Router>
                    <Switch>
                        <Route exact path="/" component={HomePageWithDialogBox} />
                        <Route path="/team/:filter" component={Team} />
                        <Route path="/profile/:filter/:user" component={(this.clientWidth < SMALL_TABLET) ? ProfilePageEnhanced : MainPageWithDialogBox} />
                        <Route path="/chatslist/:filter" component={(this.clientWidth < SMALL_TABLET) ? M_MainPageEnhanced : MainPageWithDialogBox} />
                        <Route path="/chatroom/chat/:room_id" component={(this.clientWidth < SMALL_TABLET) ? ChatPageEnhanced : MainPageWithDialogBox} />
                        <Route path="/chatroom/settings/:room_id" component={ChatRoomSettings} />
                        <Route path="/admin/:filter" component={AdminPageEnhanced} />
                    </Switch>
                </Router>
            </Provider>
        );
    }
}
export default App;
