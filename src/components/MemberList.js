"use strict";
var React = require("react");
var List_1 = require("material-ui/List");
var Divider_1 = require("material-ui/Divider");
var FontIcon_1 = require("material-ui/FontIcon");
var IconButton_1 = require("material-ui/IconButton");
var colors_1 = require("material-ui/styles/colors");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Avatar_1 = require("material-ui/Avatar");
var Toggle_1 = require("material-ui/Toggle");
var addMemberView = function (item, onAdded) { return (React.createElement(IconButton_1["default"], { tooltip: "Add Member", onClick: function () { return onAdded(item); }, style: { marginTop: 0 } },
    React.createElement(FontIcon_1["default"], { color: colors_1.indigoA700, className: "material-icons" }, "add_circle"))); };
var renderList = function (props) { return props.items.map(function (item, i) {
    return React.createElement("div", { key: i },
        React.createElement(List_1.ListItem, { onClick: (!!props.onSelected) ? function () { return props.onSelected(item); } : function () { }, leftAvatar: (!!item.avatar) ?
                React.createElement(Avatar_1["default"], { size: 32, src: item.avatar }) : React.createElement(Avatar_1["default"], { size: 32 }, item.username.charAt(0)), rightIcon: (props.onAdded) ? addMemberView(item, props.onAdded) : null, rightToggle: (props.rightToggle) ?
                React.createElement(Toggle_1["default"], { onToggle: function (event, isInputChecked) {
                        props.onToggleItem(item, isInputChecked);
                    }, disabled: true, defaultToggled: true }) : null, primaryText: item.username }),
        React.createElement(Divider_1["default"], { inset: true }));
}); };
exports.MemberList = function (props) { return (React.createElement(MuiThemeProvider_1["default"], null,
    React.createElement(List_1.List, null, (!!props.items) ? renderList(props) : null))); };
