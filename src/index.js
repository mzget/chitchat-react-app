import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, Link, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

/**
 * ### configureStore
 *  ```configureStore``` will connect the ```reducers```,
 */
import Store from './redux/configureStore';

import App from './App';
import './index.css';
import 'rxjs';

ReactDOM.render((
  <Provider store={Store}>
    <Router history={browserHistory}>
      <Route path="/" component={App} />
    </Router>
  </Provider>),
  document.getElementById('root')
);
