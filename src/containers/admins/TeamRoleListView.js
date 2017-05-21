import * as React from "react";
import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import Subheader from "material-ui/Subheader";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
const renderList = (props) => (props.items.map((item, i) => {
    return (React.createElement("div", { key: i },
        React.createElement(ListItem, { onClick: () => props.onSelected(item), rightIcon: null, primaryText: item }),
        React.createElement(Divider, { inset: true })));
}));
export const TeamRoleList = (props) => (React.createElement(MuiThemeProvider, null,
    React.createElement(Subheader, null, "Team roles."),
    React.createElement(List, null, (!!props.items) ? renderList(props) : null)));
