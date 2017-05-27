import * as React from 'react';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
const BadgeSimple = (props) => (React.createElement(MuiThemeProvider, null,
    React.createElement(Badge, { badgeContent: props.content, badgeStyle: { backgroundColor: "red" }, secondary: true, style: { paddingLeft: "0", paddingRight: "16px" } },
        React.createElement(NotificationsIcon, null))));
export default BadgeSimple;
