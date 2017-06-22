import * as React from "react";
import { Flex } from "reflexbox";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import Avatar from "material-ui/Avatar";
export const GroupMember = (props) => (React.createElement(MuiThemeProvider, null,
    React.createElement(Flex, { flexColumn: true, align: "center" },
        React.createElement(List, { style: { width: "100%" } },
            " ",
            (props.members && props.members.length > 0) ?
                props.members.map((item, i, arr) => (React.createElement("div", { key: i },
                    (!!item.username) ? (React.createElement(ListItem, { leftAvatar: (!!item.avatar) ?
                            React.createElement(Avatar, { src: item.avatar }) : React.createElement(Avatar, null, item.username.charAt(0)), primaryText: (!!item.username) ? item.username : "Empty user name", secondaryText: React.createElement("p", null,
                            React.createElement("span", { style: { color: Colors.darkBlack } }, item.email)) })) : null,
                    React.createElement(Divider, { inset: true })))) : null),
        React.createElement(Divider, { inset: true }))));
