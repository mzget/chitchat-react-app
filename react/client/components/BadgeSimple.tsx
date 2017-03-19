import * as React from 'react';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const BadgeSimple = (props: { content: any }) => (
    <MuiThemeProvider>
        <Badge
            badgeContent={props.content}
            badgeStyle={{ backgroundColor: "red" }}
            secondary={true}
            >
            <NotificationsIcon />
        </Badge>
    </MuiThemeProvider>
);

export default BadgeSimple;