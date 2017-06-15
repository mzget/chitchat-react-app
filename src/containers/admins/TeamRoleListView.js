"use strict";
var React = require("react");
var List_1 = require("material-ui/List");
var Divider_1 = require("material-ui/Divider");
var Subheader_1 = require("material-ui/Subheader");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var renderList = function (props) { return (props.items.map(function (item, i) {
    return (React.createElement("div", { key: i },
        React.createElement(List_1.ListItem, { onClick: function () { return props.onSelected(item); }, rightIcon: null, primaryText: item }),
        React.createElement(Divider_1["default"], { inset: true })));
})); };
exports.TeamRoleList = function (props) { return (React.createElement(MuiThemeProvider_1["default"], null,
    React.createElement(Subheader_1["default"], null, "Team roles."),
    React.createElement(List_1.List, null, (!!props.items) ? renderList(props) : null))); };
