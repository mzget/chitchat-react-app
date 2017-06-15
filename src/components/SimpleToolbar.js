"use strict";
var React = require("react");
var IconMenu_1 = require("material-ui/IconMenu");
var IconButton_1 = require("material-ui/IconButton");
var expand_more_1 = require("material-ui/svg-icons/navigation/expand-more");
var MenuItem_1 = require("material-ui/MenuItem");
var Toolbar_1 = require("material-ui/Toolbar");
var Colors = require("material-ui/styles/colors");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var getMuiTheme_1 = require("material-ui/styles/getMuiTheme");
var muiTheme = getMuiTheme_1["default"]({
    palette: {
        textColor: Colors.darkBlack,
        alternateTextColor: Colors.darkWhite,
        primary1Color: Colors.indigo200,
        primary2Color: Colors.indigo700,
        accent1Color: Colors.redA200,
        pickerHeaderColor: Colors.darkBlack
    },
    toolbar: {
        color: Colors.white,
        backgroundColor: Colors.indigo500
    }
});
exports.SimpleToolbar = function (props) { return (React.createElement(MuiThemeProvider_1["default"], { muiTheme: muiTheme },
    React.createElement(Toolbar_1.Toolbar, null,
        React.createElement(Toolbar_1.ToolbarGroup, { firstChild: true },
            (props.onBackPressed) ?
                React.createElement(IconButton_1["default"], { iconClassName: "material-icons", onClick: props.onBackPressed }, "chevron_left")
                :
                    React.createElement("span", { style: { margin: 8 } }),
            React.createElement(Toolbar_1.ToolbarTitle, { text: props.title, style: { color: Colors.white }, onClick: props.onPressTitle })),
        React.createElement(Toolbar_1.ToolbarGroup, null,
            (props.groupItem) ? (React.createElement(Toolbar_1.ToolbarGroup, null, props.groupItem)) : null,
            React.createElement(Toolbar_1.ToolbarSeparator, null),
            (props.menus && props.menus.length > 0) ?
                (React.createElement(IconMenu_1["default"], { iconButtonElement: React.createElement(IconButton_1["default"], null,
                        React.createElement(expand_more_1["default"], null)), anchorOrigin: { horizontal: "right", vertical: "top" }, targetOrigin: { horizontal: "right", vertical: "top" } }, props.menus.map(function (value, i, arr) {
                    return React.createElement(MenuItem_1["default"], { key: i, primaryText: value, onClick: function () { return props.onSelectedMenuItem(i, value); } });
                }))) : null)))); };
