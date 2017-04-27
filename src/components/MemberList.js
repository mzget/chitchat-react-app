"use strict";
const React = require("react");
const List_1 = require("material-ui/List");
const Divider_1 = require("material-ui/Divider");
const FontIcon_1 = require("material-ui/FontIcon");
const IconButton_1 = require("material-ui/IconButton");
const colors_1 = require("material-ui/styles/colors");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Avatar_1 = require("material-ui/Avatar");
const Toggle_1 = require("material-ui/Toggle");
const addMemberView = (item, onAdded) => (React.createElement(IconButton_1.default, { tooltip: "Add Member", onClick: () => onAdded(item), style: { marginTop: 0 } },
    React.createElement(FontIcon_1.default, { color: colors_1.indigoA700, className: "material-icons" }, "add_circle")));
const renderList = (props) => props.items.map((item, i) => React.createElement("div", { key: i },
    React.createElement(List_1.ListItem, { onClick: (!!props.onSelected) ? () => props.onSelected(item) : () => { }, leftAvatar: (!!item.avatar) ?
            React.createElement(Avatar_1.default, { size: 32, src: item.avatar }) : React.createElement(Avatar_1.default, { size: 32 }, item.username.charAt(0)), rightIcon: (props.onAdded) ? addMemberView(item, props.onAdded) : null, rightToggle: (props.rightToggle) ?
            React.createElement(Toggle_1.default, { onToggle: (event, isInputChecked) => {
                    props.onToggleItem(item, isInputChecked);
                }, disabled: true, defaultToggled: true }) : null, primaryText: item.username }),
    React.createElement(Divider_1.default, { inset: true })));
exports.MemberList = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(List_1.List, null, (!!props.items) ? renderList(props) : null)));
