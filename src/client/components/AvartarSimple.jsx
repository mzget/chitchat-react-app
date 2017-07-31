import * as React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Avatar from 'material-ui/Avatar';
const AvatarSimple = (props) => (<MuiThemeProvider>
        <div>
            {(!!props.src) ?
    <Avatar src={props.src}/> : <Avatar>{props.letter.charAt(0)}</Avatar>}
        </div>
    </MuiThemeProvider>);
export default AvatarSimple;
