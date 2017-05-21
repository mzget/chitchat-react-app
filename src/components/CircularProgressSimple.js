var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { withReflex } from 'reflexbox';
const CircularProgressSimple = (props) => (React.createElement(MuiThemeProvider, null,
    React.createElement("div", __assign({}, props),
        React.createElement(CircularProgress, { thickness: 7 }))));
export default withReflex()(CircularProgressSimple);
