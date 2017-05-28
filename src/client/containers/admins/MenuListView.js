import * as React from "react";
import { List, ListItem } from "material-ui/List";
import ActionGrade from "material-ui/svg-icons/action/grade";
import Divider from "material-ui/Divider";
import ActionInfo from "material-ui/svg-icons/action/info";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Subheader from "material-ui/Subheader";
const getItem = (props) => {
    return props.menus.map((item, i, arr) => React.createElement(ListItem, { key: i, primaryText: item, leftIcon: React.createElement(ActionGrade, null), rightIcon: React.createElement(ActionInfo, null), onClick: () => props.onSelectItem(item) }));
};
export const MenuListview = (props) => (React.createElement(MuiThemeProvider, null,
    React.createElement("div", null,
        (props.title) ? React.createElement(Subheader, null, props.title) : null,
        React.createElement(List, null,
            " ",
            (props.menus && props.menus.length > 0) ?
                getItem(props) : null),
        React.createElement(Divider, null),
        React.createElement(Divider, null))));
