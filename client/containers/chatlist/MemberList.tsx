import * as React from 'react';
import { Flex, Box } from 'reflexbox';

import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import { grey400, darkBlack, lightBlack } from 'material-ui/styles/colors';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Avatar from 'material-ui/Avatar';

import BadgeSimple from "../../components/BadgeSimple";

import { ChitChatAccount } from "../../../server/scripts/models/User";

interface IComponentProps {
    value: Array<ChitChatAccount>;
    onSelected: (item: ChitChatAccount) => void;
}

const renderList = (props: IComponentProps) => (props.value.map((item, i) => {
    return (
        <div key={i}>
            <ListItem
                onClick={() => props.onSelected(item)}
                leftAvatar={(!!item.image) ?
                    <Avatar src={item.image} /> : <Avatar>{item.username.charAt(0)}</Avatar>
                }
                rightIcon={null}
                primaryText={item.username}
                secondaryText={
                    <p>
                        <span style={{ color: darkBlack }}>{item.email}</span>
                    </p>
                }
                />
            <Divider inset={true} />
        </div>)
})
);

export const MemberList = (props: IComponentProps) => (
    < MuiThemeProvider >
        <List>
            {(!!props.value) ? renderList(props) : null}
        </List>
    </ MuiThemeProvider >
);