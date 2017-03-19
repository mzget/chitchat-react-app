"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const List_1 = require("material-ui/List");
const Divider_1 = require("material-ui/Divider");
const Subheader_1 = require("material-ui/Subheader");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const renderList = (props) => (props.items.map((item, i) => {
    return (React.createElement("div", { key: i },
        React.createElement(List_1.ListItem, { onClick: () => props.onSelected(item), rightIcon: null, primaryText: item }),
        React.createElement(Divider_1.default, { inset: true })));
}));
exports.TeamRoleList = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(Subheader_1.default, null, "Team roles."),
    React.createElement(List_1.List, null, (!!props.items) ? renderList(props) : null)));
