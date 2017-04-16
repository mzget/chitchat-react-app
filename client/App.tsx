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
import Chat from "./containers/Chat";
import ChatRoomSettings from "./containers/ChatRoomSettings";
import Team from "./containers/Team";
import Profile from "./containers/Profile";
import Main from "./containers/Main";
import Admin from "./containers/Admin";

chitchatFactory.initStore(Store);
Store.subscribe(() =>
    chitchatFactory.setAuthStore(Store.getState().userReducer.user, Store.getState().authReducer.token)
);

class App extends React.Component<any, any> {
    render() {
        return (
            <Provider store={Store}>
                <Router history={browserHistory}>
                    <Route path="/(:filter)" component={HomeEnhanced} />
                    <Route path="/chat/(:filter)" component={Chat} />
                    <Route path="/chat/:filter/:room_id" component={ChatRoomSettings} />
                    <Route path="/team/(:filter)" component={Team} />
                    <Route path="/team/(:filter)/:user" component={Profile} />
                    <Route path="/chatslist/(:filter)" component={Main} />
                    <Route path="/admin/(:filter)" component={Admin} />
                </Router>
            </Provider>
        );
    }
}
export default App;
