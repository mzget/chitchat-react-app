import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import Badge from 'material-ui/Badge';
export const ChatTabs = (props) => (<Tabs>
        <Tab style={{ height: 60 }} icon={<FontIcon className="material-icons">group</FontIcon>}>
            {props.groupComp}
        </Tab>
        <Tab style={{ height: 60, top: (props.logCount && props.logCount > 0) ? 8 : 0 }} icon={(props.logCount && props.logCount > 0) ?
    <Badge badgeContent={props.logCount} primary={true}>
                    <FontIcon className="material-icons">chat</FontIcon>
                </Badge>
    :
        <FontIcon className="material-icons">chat</FontIcon>}>
            {props.chatlogs}
        </Tab>
    </Tabs>);
