"use strict";
const React = require("react");
const IconMenu_1 = require("material-ui/IconMenu");
const IconButton_1 = require("material-ui/IconButton");
const expand_more_1 = require("material-ui/svg-icons/navigation/expand-more");
const MenuItem_1 = require("material-ui/MenuItem");
const Toolbar_1 = require("material-ui/Toolbar");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const SimpleToolbar = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(Toolbar_1.Toolbar, null,
        React.createElement(Toolbar_1.ToolbarTitle, { text: props.title }),
        React.createElement(Toolbar_1.ToolbarGroup, null,
            React.createElement(Toolbar_1.ToolbarSeparator, null),
            React.createElement(IconMenu_1.default, { iconButtonElement: React.createElement(IconButton_1.default, { touch: true },
                    React.createElement(expand_more_1.default, null)) },
                React.createElement(MenuItem_1.default, { primaryText: "Download" }),
                React.createElement(MenuItem_1.default, { primaryText: "More Info" }))))));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SimpleToolbar;
