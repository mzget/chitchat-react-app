import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
const AppBarIcon = (props) => (<MuiThemeProvider>
        <AppBar title={props.title} showMenuIconButton={false}/>
    </MuiThemeProvider>);
export default AppBarIcon;
