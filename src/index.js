import * as React from 'react';
import ReactDOM from 'react-dom';
import App from './client/App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import 'rxjs';
global.userAgent = "react-js";
const injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
