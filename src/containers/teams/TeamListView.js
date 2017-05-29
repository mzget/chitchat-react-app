"use strict";
var React = require("react");
var List_1 = require("material-ui/List");
var grade_1 = require("material-ui/svg-icons/action/grade");
var Divider_1 = require("material-ui/Divider");
var info_1 = require("material-ui/svg-icons/action/info");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var getItem = function (props) {
    return props.items.map(function (item, i, arr) {
        return React.createElement(List_1.ListItem, { key: i, primaryText: item.name, leftIcon: React.createElement(grade_1["default"], null), rightIcon: (props.actionChild) ? props.actionChild : React.createElement(info_1["default"], null), onClick: function () { return props.onSelectItem(item); } });
    });
};
exports.TeamListView = function (props) { return (React.createElement(MuiThemeProvider_1["default"], null,
    React.createElement("div", null,
        React.createElement(List_1.List, null, (props.items && props.items.length > 0) ?
            getItem(props) : null),
        React.createElement(Divider_1["default"], null)))); };
