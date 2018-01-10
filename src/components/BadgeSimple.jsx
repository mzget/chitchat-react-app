import * as React from 'react';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
const BadgeSimple = (props) => (<MuiThemeProvider>
        <Badge badgeContent={props.content} badgeStyle={{ backgroundColor: "red" }} secondary={true} style={{ paddingLeft: "0", paddingRight: "16px" }}>
            <NotificationsIcon />
        </Badge>
    </MuiThemeProvider>);
export default BadgeSimple;
