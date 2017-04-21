import * as React from "react";
import { Provider } from "react-redux";
import { Router, Route, browserHistory } from "react-router";

import { chitchatFactory } from "./chitchat";
/**
 * ### configureStore
 *  ```configureStore``` will connect the ```reducers```,
 */
import Store from "./redux/configureStore";

import { HomeEnhanced } from "./containers/HomeEnhanced";
import { ChatPageEnhanced } from "./containers/ChatPageEnhanced";
import { ChatPage } from "./containers/Chat";
import ChatRoomSettings from "./containers/ChatRoomSettings";
import Team from "./containers/Team";
import { ProfilePageEnhanced } from "./containers/ProfilePageEnhanced";
import Main from "./containers/Main";
import m_Main from "./containers/m_Main";
import { AdminPageEnhanced } from "./containers/AdminPageEnhanced";

import { SMALL_TABLET, MEDIUM_HANDSET } from "./chitchat/consts/Breakpoints";

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
                <Router history={browserHistory}>
                    <Route path="/(:filter)" component={HomeEnhanced} />
                    <Route path="/chat/(:filter)" component={(this.clientWidth < MEDIUM_HANDSET) ? ChatPageEnhanced : ChatPage} />
                    <Route path="/chat/:filter/:room_id" component={ChatRoomSettings} />
                    <Route path="/team/(:filter)" component={Team} />
                    <Route path="/team/(:filter)/:user" component={(this.clientWidth < MEDIUM_HANDSET) ? ProfilePageEnhanced : Main} />
                    <Route path="/chatslist/(:filter)" component={(this.clientWidth < MEDIUM_HANDSET) ? m_Main : Main} />
                    <Route path="/admin/(:filter)" component={AdminPageEnhanced} />
                </Router>
            </Provider>
        );
    }
}
export default App;
