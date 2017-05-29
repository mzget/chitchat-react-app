"use strict";
var React = require("react");
var List_1 = require("material-ui/List");
var Divider_1 = require("material-ui/Divider");
var colors_1 = require("material-ui/styles/colors");
var IconButton_1 = require("material-ui/IconButton");
var more_vert_1 = require("material-ui/svg-icons/navigation/more-vert");
var IconMenu_1 = require("material-ui/IconMenu");
var MenuItem_1 = require("material-ui/MenuItem");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Avatar_1 = require("material-ui/Avatar");
var BadgeSimple_1 = require("../../components/BadgeSimple");
var iconButtonElement = (React.createElement(IconButton_1["default"], { touch: true, tooltip: "more", tooltipPosition: "bottom-left" },
    React.createElement(more_vert_1["default"], { color: colors_1.grey400 })));
var rightIconMenu = function (log, onRemovedLog) { return (React.createElement(IconMenu_1["default"], { iconButtonElement: iconButtonElement, onChange: function (event, value) {
        onRemovedLog(log);
    } },
    React.createElement(MenuItem_1["default"], { value: "1", style: { paddingLeft: "0", paddingRight: "0" } }, "Delete"))); };
var renderList = function (props) { return (props.value.map(function (log, i) {
    return (React.createElement("div", { key: i },
        React.createElement(List_1.ListItem, { leftAvatar: (!!log.room.image) ?
                React.createElement(Avatar_1["default"], { src: log.room.image }) :
                React.createElement(Avatar_1["default"], null, log.roomName.charAt(0)), primaryText: React.createElement("div", null, log.roomName), secondaryText: React.createElement("div", null,
                React.createElement("span", { style: { color: colors_1.darkBlack } }, log.lastMessage)), onClick: function () { return props.onSelected(log); }, children: React.createElement("div", { key: log.id, style: { float: "right", position: "absolute", top: "10%", right: "2%", margin: "auto" } },
                (log.count && log.count != 0) ? React.createElement(BadgeSimple_1["default"], { content: log.count }) : null,
                rightIconMenu(log, props.onRemovedLog)) }),
        React.createElement(Divider_1["default"], { inset: true })));
})); };
exports.ListChatLogs = function (props) { return (React.createElement(MuiThemeProvider_1["default"], null,
    React.createElement(List_1.List, null, (!!props.value) ? renderList(props) : null))); };
