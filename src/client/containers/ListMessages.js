"use strict";
const React = require("react");
const List_1 = require("material-ui/List");
const Divider_1 = require("material-ui/Divider");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const renderList = (props) => (props.value.map((message, i) => {
    return (React.createElement("div", { key: i },
        React.createElement(Divider_1.default, { inset: true })));
}));
const ListMessages = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(List_1.List, null, (!!props.value) ? renderList(props) : null)));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ListMessages;
