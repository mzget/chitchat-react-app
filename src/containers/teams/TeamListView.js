import * as React from "react";
import { List, ListItem } from "material-ui/List";
import ActionGrade from "material-ui/svg-icons/action/grade";
import Divider from "material-ui/Divider";
import ActionInfo from "material-ui/svg-icons/action/info";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
const getItem = (props) => {
    return props.items.map((item, i, arr) => React.createElement(ListItem, { key: i, primaryText: item.name, leftIcon: React.createElement(ActionGrade, null), rightIcon: (props.actionChild) ? props.actionChild : React.createElement(ActionInfo, null), onClick: () => props.onSelectItem(item) }));
};
export const TeamListView = (props) => (React.createElement(MuiThemeProvider, null,
    React.createElement("div", null,
        React.createElement(List, null, (props.items && props.items.length > 0) ?
            getItem(props) : null),
        React.createElement(Divider, null))));
