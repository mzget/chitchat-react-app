import * as React from "react";
import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import { darkBlack } from "material-ui/styles/colors";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Avatar from "material-ui/Avatar";
const renderList = (props) => (props.values.map((item, i) => {
    return (React.createElement("div", { key: i },
        React.createElement(ListItem, { onClick: () => props.onSelected(item), leftAvatar: (!!item.image) ?
                React.createElement(Avatar, { src: item.image }) : React.createElement(Avatar, null, item.name.charAt(0)), rightIcon: null, primaryText: item.name, secondaryText: React.createElement("p", null,
                React.createElement("span", { style: { color: darkBlack } }, item.description)) }),
        React.createElement(Divider, { inset: true })));
}));
export const GroupList = (props) => (React.createElement(MuiThemeProvider, null,
    React.createElement(List, null, (!!props.values) ? renderList(props) : null)));
