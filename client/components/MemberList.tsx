import * as React from "react";
import { Flex, Box } from "reflexbox";

import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import Subheader from "material-ui/Subheader";
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import { grey400, darkBlack, lightBlack, indigoA700 } from "material-ui/styles/colors";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Avatar from "material-ui/Avatar";
import Toggle from "material-ui/Toggle";

import BadgeSimple from "./BadgeSimple";

import { ChitChatAccount } from "../chitchat/chats/models/User";

interface IComponentProps {
    items: Array<ChitChatAccount>;
    rightIcon?: any;
    rightToggle?: boolean;
    onToggleItem?: (item: ChitChatAccount, checked: boolean) => void;
    onSelected?: (item: ChitChatAccount) => void;
    onAdded?: (item: ChitChatAccount) => void;
}

export const addMemberView = (item, onAdded: (item) => void) => (
    < IconButton tooltip="Add Member" onClick={() => onAdded(item)} style={{ marginTop: 0 }}>
        <FontIcon color={indigoA700} className="material-icons" >add_circle</FontIcon>
    </IconButton >
);

const renderList = (props: IComponentProps) => props.items.map((item, i) =>
    <div key={i}>
        <ListItem
            onClick={(!!props.onSelected) ? () => props.onSelected(item) : () => { }}
            leftAvatar={(!!item.avatar) ?
                <Avatar size={32} src={item.avatar} /> : <Avatar size={32}>{item.username.charAt(0)}</Avatar>
            }
            rightIcon={(props.onAdded) ? addMemberView(item, props.onAdded) : null}
            rightToggle={(props.rightToggle) ?
                <Toggle
                    onToggle={(event: object, isInputChecked: boolean) => {
                        props.onToggleItem(item, isInputChecked);
                    }}
                    disabled={true}
                    defaultToggled={true}
                /> : null}
            primaryText={item.username}
        />
        <Divider inset={true} />
    </div>
);

export const MemberList = (props: IComponentProps) => (
    <MuiThemeProvider>
        <List>
            {(!!props.items) ? renderList(props) : null}
        </List>
    </MuiThemeProvider>
);