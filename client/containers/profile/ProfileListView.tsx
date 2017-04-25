import * as React from "react";
import { Flex, Box } from "reflexbox";

import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import Subheader from "material-ui/Subheader";
import { grey400, darkBlack, lightBlack } from "material-ui/styles/colors";

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
                        primaryText={props.item.username}
                        secondaryText={
                            <p>
                                <span style={{ color: darkBlack }}>{props.item.email}</span>
                            </p>
                        }
                    />
                </List> : null
        }
    </ MuiThemeProvider >
);