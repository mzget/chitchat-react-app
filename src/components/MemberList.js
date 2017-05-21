import * as React from "react";
import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import { indigoA700 } from "material-ui/styles/colors";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Avatar from "material-ui/Avatar";
import Toggle from "material-ui/Toggle";
const addMemberView = (item, onAdded) => (React.createElement(IconButton, { tooltip: "Add Member", onClick: () => onAdded(item), style: { marginTop: 0 } },
    React.createElement(FontIcon, { color: indigoA700, className: "material-icons" }, "add_circle")));
const renderList = (props) => props.items.map((item, i) => React.createElement("div", { key: i },
    React.createElement(ListItem, { onClick: (!!props.onSelected) ? () => props.onSelected(item) : () => { }, leftAvatar: (!!item.avatar) ?
            React.createElement(Avatar, { size: 32, src: item.avatar }) : React.createElement(Avatar, { size: 32 }, item.username.charAt(0)), rightIcon: (props.onAdded) ? addMemberView(item, props.onAdded) : null, rightToggle: (props.rightToggle) ?
            React.createElement(Toggle, { onToggle: (event, isInputChecked) => {
                    props.onToggleItem(item, isInputChecked);
                }, disabled: true, defaultToggled: true }) : null, primaryText: item.username }),
    React.createElement(Divider, { inset: true })));
export const MemberList = (props) => (React.createElement(MuiThemeProvider, null,
    React.createElement(List, null, (!!props.items) ? renderList(props) : null)));
