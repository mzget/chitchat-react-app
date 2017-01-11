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

class App extends Component {
    render() {
        return (
            <Provider store={Store}>
                <Router history={browserHistory}>
                    <Route path="/(:filter)" component={Home} />
                    <Route path="/chat/(:filter)" component={Chat} />
                </Router>
            </Provider>
        );
    }
}
export default App;
