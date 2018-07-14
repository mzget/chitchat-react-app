import * as React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { withReflex } from 'reflexbox';
const CircularProgressSimple = (props) => (<MuiThemeProvider>
        <div {...props}>
            <CircularProgress thickness={7}/>
        </div>
    </MuiThemeProvider>);
export default withReflex()(CircularProgressSimple);
