"use strict";
exports.__esModule = true;
var React = require("react");
var List_1 = require("material-ui/List");
var grade_1 = require("material-ui/svg-icons/action/grade");
var Divider_1 = require("material-ui/Divider");
var info_1 = require("material-ui/svg-icons/action/info");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Subheader_1 = require("material-ui/Subheader");
var getItem = function (props) {
    return props.menus.map(function (item, i, arr) {
        return React.createElement(List_1.ListItem, { key: i, primaryText: item, leftIcon: React.createElement(grade_1["default"], null), rightIcon: React.createElement(info_1["default"], null), onClick: function () { return props.onSelectItem(item); } });
    });
};
exports.MenuListview = function (props) { return (React.createElement(MuiThemeProvider_1["default"], null,
    React.createElement("div", null,
        (props.title) ? React.createElement(Subheader_1["default"], null, props.title) : null,
        React.createElement(List_1.List, null,
            " ",
            (props.menus && props.menus.length > 0) ?
                getItem(props) : null),
        React.createElement(Divider_1["default"], null),
        React.createElement(Divider_1["default"], null)))); };
