import React, { Component } from 'react';
import { Provider } from "react-redux";
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

/**
 * ### configureStore
 *  ```configureStore``` will connect the ```reducers```,
 */
import Store from "./client/redux/configureStore";
// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, Store);
history.listen(location => console.log(location.pathname));

import Home from "./client/containers/Home";
import Chat from "./client/containers/Chat";
import ChatRoomSettings from "./client/containers/ChatRoomSettings";
import Team from "./client/containers/Team";
import Main from "./client/containers/Main";
import Admin from "./client/containers/Admin";

class App extends Component {
    render() {
        return (
            <Provider store={Store}>
                <Router history={history}>
                    <Route path="/(:filter)" component={Home} />
                    <Route path="/chat/(:filter)" component={Chat} />
                    <Route path="/roomSettings/(:filter)" component={ChatRoomSettings} />
                    <Route path="/team/(:filter)" component={Team} />
                    <Route path="/chatslist/(:filter)" component={Main} />
                    <Route path="/admin/(:filter)" component={Admin} />
                </Router>
            </Provider>
        );
    }
}
export default App;
