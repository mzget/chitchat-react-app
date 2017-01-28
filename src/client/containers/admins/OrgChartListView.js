"use strict";
const React = require("react");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const List_1 = require("material-ui/List");
const Divider_1 = require("material-ui/Divider");
const Subheader_1 = require("material-ui/Subheader");
const colors_1 = require("material-ui/styles/colors");
const renderList = (props) => (props.items.map((item, i) => (React.createElement("div", { key: i },
    React.createElement(List_1.ListItem, { onClick: () => props.onSelected(item), leftIcon: null, rightIcon: null, primaryText: item.chart_name, secondaryText: React.createElement("p", null,
            React.createElement("span", { style: { color: colors_1.darkBlack } }, item.chart_description)) }),
    React.createElement(Divider_1.default, { inset: true })))));
exports.OrgChartListView = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement("div", null,
        React.createElement(Subheader_1.default, null, "Org Charts"),
        React.createElement(List_1.List, null, (!!props.items) ? renderList(props) : null))));
