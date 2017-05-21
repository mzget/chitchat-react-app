import * as React from "react";
import { Flex } from "reflexbox";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import Avatar from "material-ui/Avatar";
export const EditGroupMember = (props) => (React.createElement(MuiThemeProvider, null,
    React.createElement(Flex, { flexColumn: true, align: "center" },
        React.createElement(List, { style: { width: "100%" } },
            " ",
            (props.members && props.members.length > 0) ?
                props.members.map((item, i, arr) => {
                    return (React.createElement("div", { key: i },
                        React.createElement(ListItem, { leftAvatar: (!!item.avatar) ?
                                React.createElement(Avatar, { src: item.avatar, size: 30 }) :
                                (!!item.username) ?
                                    React.createElement(Avatar, { size: 30 }, item.username.charAt(0)) :
                                    null, primaryText: item.username, rightIconButton: props.rightIconButton(item) }),
                        React.createElement(Divider, { inset: true })));
                }) : null))));
