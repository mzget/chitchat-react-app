global.userAgent = navigator.userAgent;

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

/**
 * ### configureStore
 *  ```configureStore``` will connect the ```reducers```,
 */
import Store from './client/redux/configureStore';

import App from './App';
import Chat from "./client/containers/Chat";

import './index.css';
import 'rxjs';

ReactDOM.render((
  <Provider store={Store}>
    <Router history={browserHistory}>
      <Route path="/(:filter)" component={App} />
      <Route path="/chat/(:filter)" component={Chat} />
    </Router>
  </Provider>),
  document.getElementById('root')
);
