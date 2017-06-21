"use strict";
exports.__esModule = true;
var React = require("react");
var reflexbox_1 = require("reflexbox");
var Divider_1 = require("material-ui/Divider");
var Card_1 = require("material-ui/Card");
var FlatButton_1 = require("material-ui/FlatButton");
var colors_1 = require("material-ui/styles/colors");
exports.CardFileWithAvatar = function (props) { return (React.createElement("div", { style: { padding: 2, color: colors_1.grey400 } },
    React.createElement(Card_1.Card, null,
        React.createElement(Card_1.CardHeader, { title: React.createElement("span", { style: { color: "blue" } }, props.title), subtitle: React.createElement("span", null, props.subtitle), avatar: props.avatar }),
        React.createElement(reflexbox_1.Flex, { flexColumn: false },
            props.fileIcon,
            React.createElement("p", { style: { color: colors_1.darkBlack, marginLeft: 15, fontSize: 16 } }, props.cardText)),
        React.createElement(Divider_1["default"], { inset: false }),
        React.createElement(Card_1.CardActions, null,
            React.createElement(FlatButton_1["default"], { label: "Open", primary: true, onClick: props.openAction })),
        (!!props.readers && props.readers.length) ? (React.createElement("div", null,
            React.createElement(Divider_1["default"], { inset: false }),
            React.createElement("a", { style: { padding: 5 }, onClick: props.onClickReader }, props.readers))) : null))); };
