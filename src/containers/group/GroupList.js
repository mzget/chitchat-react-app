"use strict";
exports.__esModule = true;
var React = require("react");
var List_1 = require("material-ui/List");
var Divider_1 = require("material-ui/Divider");
var colors_1 = require("material-ui/styles/colors");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Avatar_1 = require("material-ui/Avatar");
var renderList = function (props) { return (props.values.map(function (item, i) {
    return (React.createElement("div", { key: i },
        React.createElement(List_1.ListItem, { onClick: function () { return props.onSelected(item); }, leftAvatar: (!!item.image) ?
                React.createElement(Avatar_1["default"], { src: item.image }) : React.createElement(Avatar_1["default"], null, item.name.charAt(0)), rightIcon: null, primaryText: item.name, secondaryText: React.createElement("p", null,
                React.createElement("span", { style: { color: colors_1.darkBlack } }, item.description)) }),
        React.createElement(Divider_1["default"], { inset: true })));
})); };
exports.GroupList = function (props) { return (React.createElement(MuiThemeProvider_1["default"], null,
    React.createElement(List_1.List, null, (!!props.values) ? renderList(props) : null))); };
