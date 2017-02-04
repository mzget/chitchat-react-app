"use strict";
const React = require("react");
const List_1 = require("material-ui/List");
const Divider_1 = require("material-ui/Divider");
const Subheader_1 = require("material-ui/Subheader");
const colors_1 = require("material-ui/styles/colors");
const renderList = (props) => (props.items.map((item, i) => (React.createElement("div", { key: i },
    React.createElement(List_1.ListItem, { leftIcon: null, rightIcon: null, primaryText: item.chart_name, secondaryText: React.createElement("p", { style: { color: colors_1.darkBlack } }, item.chart_description) })))));
exports.OrgChartListView = (props) => (React.createElement("div", null,
    React.createElement(Subheader_1.default, null, "Org Charts"),
    React.createElement(List_1.List, null, (!!props.items) ? renderList(props) : null),
    React.createElement(Divider_1.default, null)));
