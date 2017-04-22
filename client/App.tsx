import * as React from "react";
import { Provider } from "react-redux";
import {
    BrowserRouter as Router,
    Route,
    Link
} from "react-router-dom";

import { chitchatFactory } from "./chitchat";
/**
 * ### configureStore
 *  ```configureStore``` will connect the ```reducers```,
 */
import Store from "./redux/configureStore";

import { HomeEnhanced } from "./containers/HomeEnhanced";
import { ConnectedChatPageEnhanced } from "./containers/ChatPageEnhanced";
import ChatRoomSettings from "./containers/ChatRoomSettings";
import Team from "./containers/Team";
import { ProfilePageEnhanced } from "./containers/ProfilePageEnhanced";
import { MainPage } from "./containers/Main";
import { m_MainPage } from "./containers/m_Main";
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
                    <div>
                        <Route exact path="/" component={HomeEnhanced} />
                        <Route path="/team/:filter" component={Team} />
                        <Route path="/profile/:filter/:user" component={(this.clientWidth < SMALL_TABLET) ? ProfilePageEnhanced : MainPage} />
                        <Route path="/chatslist/:filter" component={(this.clientWidth < SMALL_TABLET) ? m_MainPage : MainPage} />
                        <Route path="/chatroom/:filter/:room_id" component={(this.clientWidth < SMALL_TABLET) ? ConnectedChatPageEnhanced : MainPage} />
                        <Route path="/chatroom/:filter/:room_id" component={ChatRoomSettings} />
                        <Route path="/admin/:filter" component={AdminPageEnhanced} />
                    </div>
                </Router>
            </Provider>
        );
    }
}
export default App;
