import * as React from "react";
import { Flex, Box } from "reflexbox";

import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import Subheader from "material-ui/Subheader";
import * as Color from "material-ui/styles/colors";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Avatar from "material-ui/Avatar";

import BadgeSimple from "../../components/BadgeSimple";

import { ChitChatAccount } from "../../chitchat/chats/models/User";

interface IComponentProps {
    item: ChitChatAccount;
    onSelected: (item: ChitChatAccount) => void;
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
                        primaryText={<span style={{ color: Color.grey50 }}>{props.item.username}</span>}
                        secondaryText={
                            <p>
                                <span style={{ color: Color.grey50 }}>{props.item.email}</span>
                            </p>
                        }
                    />
                </List> : null
        }
    </ MuiThemeProvider >
);