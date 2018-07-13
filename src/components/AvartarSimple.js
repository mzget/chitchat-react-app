import * as React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Avatar from 'material-ui/Avatar';
/**
 * Examples of `Avatar` using an image, [Font Icon](/#/components/font-icon), [SVG Icon](/#/components/svg-icon)
 * and "Letter" (string), with and without custom colors at the default size (`40dp`) and an alternate size (`30dp`).
 */
const AvatarSimple = (props) => (<MuiThemeProvider>
        <div>
            {(!!props.src) ?
    <Avatar src={props.src}/> : <Avatar>{props.letter.charAt(0)}</Avatar>}
        </div>
    </MuiThemeProvider>);
export default AvatarSimple;
