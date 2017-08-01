import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
export const TabsExampleIconText = () => (<Tabs>
        <Tab icon={<FontIcon className="material-icons">group</FontIcon>}/>
        <Tab icon={<FontIcon className="material-icons">chat</FontIcon>}/>
    </Tabs>);
