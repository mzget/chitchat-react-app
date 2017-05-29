"use strict";
var React = require("react");
var List_1 = require("material-ui/List");
var Divider_1 = require("material-ui/Divider");
var Subheader_1 = require("material-ui/Subheader");
var colors_1 = require("material-ui/styles/colors");
var renderList = function (props) { return (props.items.map(function (item, i) { return (React.createElement("div", { key: i },
    React.createElement(List_1.ListItem, { leftIcon: null, rightIcon: null, primaryText: item.chart_name, secondaryText: React.createElement("p", { style: { color: colors_1.darkBlack } }, item.chart_description) }))); })); };
exports.OrgChartListView = function (props) { return (React.createElement("div", null,
    React.createElement(Subheader_1["default"], null, "Org Charts"),
    React.createElement(List_1.List, null, (!!props.items) ? renderList(props) : null),
    React.createElement(Divider_1["default"], null))); };
