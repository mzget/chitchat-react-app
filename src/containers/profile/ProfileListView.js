import * as React from "react";
import { List, ListItem } from "material-ui/List";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Avatar from "material-ui/Avatar";
export const ProfileListView = (props) => (React.createElement(MuiThemeProvider, null, (props.item) ?
    React.createElement(List, null,
        React.createElement(ListItem, { onClick: () => props.onSelected(props.item), leftAvatar: (!!props.item.avatar) ?
                React.createElement(Avatar, { src: props.item.avatar }) : React.createElement(Avatar, null, props.item.username.charAt(0)), rightIcon: null, primaryText: React.createElement("span", null, props.item.username), secondaryText: React.createElement("p", null,
                React.createElement("span", null, props.item.email)) })) : null));
