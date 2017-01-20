import React, { Component } from 'react';
import { Provider } from "react-redux";
import { Router, Route, browserHistory } from 'react-router';

/**
 * ### configureStore
 *  ```configureStore``` will connect the ```reducers```,
 */
import Store from './client/redux/configureStore';

import Home from "./client/containers/Home";
import Chat from "./client/containers/Chat";
import Team from "./client/containers/Team";
import Main from "./client/containers/Main";
import Admin from "./client/containers/admins/Admin";

class App extends Component {
    render() {
        return (
            <Provider store={Store}>
                <Router history={browserHistory}>
                    <Route path="/(:filter)" component={Home} />
                    <Route path="/chat/(:filter)" component={Chat} />
                    <Route path="/team/(:filter)" component={Team} />
                    <Route path="/chatslist/(:filter)" component={Main} />
                    <Route path="/admin/(:filter)" component={Admin} />
                </Router>
            </Provider>
        );
    }
}
export default App;
