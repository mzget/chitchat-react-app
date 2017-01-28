import * as React from 'react';
import { List, ListItem } from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

interface IComponentProps {
    itemName: string[];
    onSelectItem: (key: string) => void;
}

const getItem = (props: IComponentProps) => {
    return props.itemName.map((item, i, arr) =>
        <ListItem key={i} primaryText={item} leftIcon={<ActionGrade />} rightIcon={<ActionInfo />} onClick={() => props.onSelectItem(item)} />
    );
};

export const AdminMenu = (props: IComponentProps) => (
    <MuiThemeProvider >
        <div>
            <List> {
                (props.itemName && props.itemName.length > 0) ?
                    getItem(props) : null
            }
            </List>
            <Divider />
        </div>
    </MuiThemeProvider >
);