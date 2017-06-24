import * as React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Avatar from 'material-ui/Avatar';
/**
 * Examples of `Avatar` using an image, [Font Icon](/#/components/font-icon), [SVG Icon](/#/components/svg-icon)
 * and "Letter" (string), with and without custom colors at the default size (`40dp`) and an alternate size (`30dp`).
 */
const AvatarSimple = (props) => (React.createElement(MuiThemeProvider, null,
    React.createElement("div", null, (!!props.src) ?
        React.createElement(Avatar, { src: props.src }) : React.createElement(Avatar, null, props.letter.charAt(0)))));
export default AvatarSimple;
