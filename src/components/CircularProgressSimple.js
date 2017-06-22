import * as React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { withReflex } from 'reflexbox';
const CircularProgressSimple = (props) => (React.createElement(MuiThemeProvider, null,
    React.createElement("div", Object.assign({}, props),
        React.createElement(CircularProgress, { thickness: 7 }))));
export default withReflex()(CircularProgressSimple);
