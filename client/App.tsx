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
import ChatRoomSettings from "./containers/ChatRoomSettings";
import Team from "./containers/Team";
import { ProfilePageEnhanced } from "./containers/ProfilePageEnhanced";
import Main from "./containers/Main";
import { AdminPageEnhanced } from "./containers/AdminPageEnhanced";

chitchatFactory.initStore(Store);
Store.subscribe(() => {
    chitchatFactory.setAuthStore(Store.getState().userReducer.user, Store.getState().authReducer.token);
    chitchatFactory.setTeamStore({
        team: Store.getState().teamReducer.team,
        members: Store.getState().teamReducer.members
    });
});

class App extends React.Component<any, any> {
    render() {
        return (
            <Provider store={Store}>
                <Router history={browserHistory}>
                    <Route path="/(:filter)" component={HomeEnhanced} />
                    <Route path="/chat/(:filter)" component={ChatPageEnhanced} />
                    <Route path="/chat/:filter/:room_id" component={ChatRoomSettings} />
                    <Route path="/team/(:filter)" component={Team} />
                    <Route path="/team/(:filter)/:user" component={ProfilePageEnhanced} />
                    <Route path="/chatslist/(:filter)" component={Main} />
                    <Route path="/admin/(:filter)" component={AdminPageEnhanced} />
                </Router>
            </Provider>
        );
    }
}
export default App;
