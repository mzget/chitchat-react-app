import * as React from "react";
import { Flex, Box } from "reflexbox";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import Avatar from "material-ui/Avatar";

import { ChitChatAccount } from "../../chitchat/chats/models/User";

export const GroupMember = (props: { members: Array<ChitChatAccount> }) => (
    <MuiThemeProvider>
        <Flex style={{ backgroundColor: Colors.indigo50 }} flexColumn align="center">
            <List> {
                (props.members && props.members.length > 0) ?
                    props.members.map((item, i, arr) => (
                        <div key={i}>
                            {(!!item.username) ? (
                                <ListItem
                                    leftAvatar={(!!item.avatar) ?
                                        <Avatar src={item.avatar} /> : <Avatar>{item.username.charAt(0)}</Avatar>
                                    }
                                    primaryText={(!!item.username) ? item.username : "Empty user name"}
                                    secondaryText={
                                        <p>
                                            <span style={{ color: Colors.darkBlack }}>{item.email}</span>
                                        </p>
                                    }
                                />) : null
                            }
                            <Divider inset={true} />
                        </div>)
                    ) : null
            }
            </List>
            <Divider inset={true} />
        </Flex>
    </MuiThemeProvider>
);