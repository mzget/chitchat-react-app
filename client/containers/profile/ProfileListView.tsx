import * as React from "react";

import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import Subheader from "material-ui/Subheader";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Avatar from "material-ui/Avatar";

import BadgeSimple from "../../components/BadgeSimple";

import { ChitChatAccount } from "../../chitchat/chats/models/User";

interface IComponentProps {
    item: ChitChatAccount;
    onSelected: (item: ChitChatAccount) => void;
    styles: any;
}

export const ProfileListView = (props: IComponentProps) => (
    < MuiThemeProvider >
        {
            (props.item) ?
                <List>
                    <ListItem
                        onClick={() => props.onSelected(props.item)}
                        leftAvatar={(!!props.item.avatar) ?
                            <Avatar src={props.item.avatar} /> : <Avatar>{props.item.username.charAt(0)}</Avatar>
                        }
                        rightIcon={null}
                        primaryText={<span style={props.styles}>{`${props.item.firstname} ${props.item.lastname}`}</span>}
                        secondaryText={
                            <p>
                                <span style={props.styles}>{props.item.email}</span>
                            </p>
                        }
                    />
                </List> : null
        }
    </ MuiThemeProvider >
);