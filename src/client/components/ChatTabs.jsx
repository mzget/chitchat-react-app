import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
export const ChatTabs = ({ groupComp, chatlogs }) => (<Tabs>
        <Tab icon={<FontIcon className="material-icons">group</FontIcon>}>
            {groupComp}
        </Tab>
        <Tab icon={<FontIcon className="material-icons">chat</FontIcon>}>
            {chatlogs}
        </Tab>
    </Tabs>);
