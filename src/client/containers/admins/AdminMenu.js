"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const List_1 = require("material-ui/List");
const grade_1 = require("material-ui/svg-icons/action/grade");
const Divider_1 = require("material-ui/Divider");
const info_1 = require("material-ui/svg-icons/action/info");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Subheader_1 = require("material-ui/Subheader");
const getItem = (props) => {
    return props.menus.map((item, i, arr) => React.createElement(List_1.ListItem, { key: i, primaryText: item, leftIcon: React.createElement(grade_1.default, null), rightIcon: React.createElement(info_1.default, null), onClick: () => props.onSelectItem(item) }));
};
exports.AdminMenu = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement("div", null,
        React.createElement(Subheader_1.default, null, "Menus"),
        React.createElement(List_1.List, null,
            " ",
            (props.menus && props.menus.length > 0) ?
                getItem(props) : null),
        React.createElement(Divider_1.default, null),
        React.createElement(Divider_1.default, null))));
