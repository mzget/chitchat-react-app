import * as React from 'react';
import { List, ListItem } from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { ITeam } from '../../../server/scripts/models/ITeam';

interface IComponentProps {
    items: ITeam[];
    onSelectItem: (team: ITeam) => void;
    actionChild?: any;
}

const getItem = (props: IComponentProps) => {
    return props.items.map((item, i, arr) =>
        <ListItem
            key={i}
            primaryText={item.name}
            leftIcon={<ActionGrade />}
            rightIcon={(props.actionChild) ? props.actionChild : < ActionInfo />}
            onClick={() => props.onSelectItem(item)}
            />
    )
};

export const TeamListView = (props: IComponentProps) => (
    <MuiThemeProvider >
        <div>
            <List>
                {
                    (props.items && props.items.length > 0) ?
                        getItem(props) : null
                }
            </List>
            <Divider />
        </div>
    </MuiThemeProvider >
);