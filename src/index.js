global.userAgent = navigator.userAgent;

import React from 'react';
import ReactDOM from 'react-dom';

const injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

import App from './App';
import './index.css';
import 'rxjs';

ReactDOM.render(
  (<App />),
  document.getElementById('root')
);
